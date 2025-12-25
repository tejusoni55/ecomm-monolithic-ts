# ----------------------------
# 1️⃣ Build stage
# ----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only dependency files first (cache optimization)
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY tsconfig.json ./
COPY src ./src
COPY drizzle ./drizzle

# Build TypeScript → JavaScript
RUN npm run build


# ----------------------------
# 2️⃣ Runtime stage
# ----------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle  ./drizzle

# Expose backend port
EXPOSE 8000

# Start the app
CMD ["node", "dist/index.js"]
    