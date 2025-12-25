import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

// import * as awsx from "@pulumi/awsx";

// Fetch ssh key
const sshPublicKeyPath = path.join(os.homedir(), ".ssh", "id_rsa.pub");
const sshPublicKey = fs.readFileSync(sshPublicKeyPath, "utf-8");

// 1) Create a VPC
const vpc = new aws.ec2.Vpc("ecomm-monolithic-vpc", {
  cidrBlock: "10.0.0.0/16",
  enableDnsHostnames: true,
  enableDnsSupport: true,
  tags: {
    Name: "ecomm-monolithic-vpc",
  },
});

// Create an Internet Gateway
const igw = new aws.ec2.InternetGateway("ecomm-monolithic-igw", {
  vpcId: vpc.id,
  tags: {
    Name: "ecomm-monolithic-igw",
  },
});

// Create ONE public subnet
const publicSubnet = new aws.ec2.Subnet("ecomm-public-subnet", {
  vpcId: vpc.id,
  cidrBlock: "10.0.1.0/24",
  availabilityZone: "ap-south-1a",
  mapPublicIpOnLaunch: true,
  tags: {
    Name: "ecomm-public-subnet",
  },
});

// Create a route table - Routes all outbound traffic to the internet
const publicRouteTable = new aws.ec2.RouteTable("ecomm-public-rt", {
  vpcId: vpc.id,
  routes: [
    {
      cidrBlock: "0.0.0.0/0",
      gatewayId: igw.id,
    },
  ],
  tags: {
    Name: "ecomm-public-rt",
  },
});

// Associate Route Table with Subnet
new aws.ec2.RouteTableAssociation("ecomm-public-rt-assoc", {
  subnetId: publicSubnet.id,
  routeTableId: publicRouteTable.id,
});

export const vpcId = vpc.id;
export const publicSubnetId = publicSubnet.id;

// 2) Create Security Group (EC2 firewall)
const ec2Sg = new aws.ec2.SecurityGroup("ecomm-monolithic-ec2-sg", {
  vpcId: vpc.id,
  description: "Security group for ecomm monolithic EC2",
  ingress: [
    // SSH
    {
      protocol: "tcp",
      fromPort: 22,
      toPort: 22,
      cidrBlocks: ["223.236.116.168/32"], // 👈 replace
    },

    // API
    {
      protocol: "tcp",
      fromPort: 8000,
      toPort: 8000,
      cidrBlocks: ["0.0.0.0/0"],
    },
  ],
  egress: [
    {
      protocol: "-1",
      fromPort: 0,
      toPort: 0,
      cidrBlocks: ["0.0.0.0/0"],
    },
  ],
  tags: {
    Name: "ecomm-monolithic-ec2-sg",
  },
});

// Create IAM Role for EC2 (ECR access)
const ec2Role = new aws.iam.Role("ecomm-monolithic-ec2-role", {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
    Service: "ec2.amazonaws.com",
  }),
});

// Attach ECR Read-only policy
new aws.iam.RolePolicyAttachment("ecomm-monolithic-ec2-ecr-policy", {
  role: ec2Role.name,
  policyArn: aws.iam.ManagedPolicy.AmazonEC2ContainerRegistryReadOnly,
});

// Create Instance Profile (mandatory)
// EC2 cannot use a role directly — it needs an Instance Profile.
const ec2InstanceProfile = new aws.iam.InstanceProfile("ecomm-monolithic-ec2-instance-profile", {
  role: ec2Role.name,
});

export const securityGroupId = ec2Sg.id;
export const instanceProfileName = ec2InstanceProfile.name;

// 3) EC2 + EBS (Persistency) Setup
// EC2 runs containers -> EBS stores Postgres data -> If EC2 restarts → data survives

// Choose an AMI (Amazon Linux 2023)
const ami = aws.ec2.getAmi({
  mostRecent: true,
  owners: ["amazon"],
  filters: [
    {
      name: "name",
      values: ["al2023-ami-*-x86_64"],
    },
  ],
});

// Create EBS volume (for Postgres)
const postgresEbs = new aws.ebs.Volume("ecomm-monolithic-postgres-ebs", {
  availabilityZone: "ap-south-1a",
  size: 15, // GB (more than enough for practice)
  type: "gp3",
  tags: {
    Name: "ecomm-monolithic-postgres-data",
  },
});

// EC2 User Data (bootstrap script)
// script should runs once when EC2 starts.
const userData = `#!/bin/bash
set -e

# Update system
dnf update -y

# Install Docker
dnf install -y docker
systemctl start docker
systemctl enable docker
usermod -aG docker ec2-user

# Install docker-compose
curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
  -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create mount directory
mkdir -p /data/postgres
`;

// Create AWS Key Pair - for SSH login
const ec2KeyPair = new aws.ec2.KeyPair("ecomm-monolithic-keypair", {
  publicKey: sshPublicKey,
  tags: {
    Name: "ecomm-monolithic-keypair",
  },
});

// Create the EC2 instance
const ec2Instance = new aws.ec2.Instance("ecomm-monolithic-ec2", {
  ami: ami.then((a) => a.id),
  instanceType: "t3.micro",
  subnetId: publicSubnet.id,
  vpcSecurityGroupIds: [ec2Sg.id],
  iamInstanceProfile: ec2InstanceProfile.name,
  keyName: ec2KeyPair.keyName, // 👈 ADD THIS
  userData: userData,
  tags: {
    Name: "ecomm-monolithic-ec2",
  },
});

// Attach EBS volume to EC2
new aws.ec2.VolumeAttachment("ecomm-monolithic-ebs-attach", {
  deviceName: "/dev/xvdf",
  volumeId: postgresEbs.id,
  instanceId: ec2Instance.id,
});

export const ec2PublicIp = ec2Instance.publicIp;
export const ec2InstanceId = ec2Instance.id;

// 4) Create ECR repository (Pulumi – preferred)
const ecrRepo = new aws.ecr.Repository("ecomm-monolithic-api-repo", {
  name: "ecomm-monolithic-api",
  imageScanningConfiguration: {
    scanOnPush: true,
  },
  forceDelete: true, // OK for practice project
});

export const ecrRepoUrl = ecrRepo.repositoryUrl;
