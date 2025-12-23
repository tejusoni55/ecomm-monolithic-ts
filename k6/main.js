import { userFlow } from "./flows/user.flow.js";

const BASE_URL = __ENV.BASE_URL || "http://localhost:8000";
const TEST_TYPE = __ENV.TEST_TYPE || "smoke";

/**
 * Define all scenarios
 */
const scenarios = {
  smoke: {
    executor: "constant-vus",
    vus: 5,
    duration: "30s",
  },

  load: {
    executor: "ramping-vus",
    startVUs: 0,
    stages: [
      { duration: "1m", target: 200 },
      // { duration: "2m", target: 300 },
      { duration: "2m", target: 500 },
      { duration: "1m", target: 0 },
    ],
  },

  stress: {
    executor: "ramping-vus",
    startVUs: 0,
    stages: [
      { duration: "1m", target: 200 },
      { duration: "1m", target: 600 },
      { duration: "1m", target: 900 },
      { duration: "1m", target: 0 },
    ],
  },

  spike: {
    executor: "ramping-vus",
    stages: [
      { duration: "10s", target: 800 },
      { duration: "20s", target: 800 },
      { duration: "20s", target: 0 },
    ],
  }
};

/**
 * Export options in the format k6 expects
 */
export const options = {
  scenarios: {
    [TEST_TYPE]: scenarios[TEST_TYPE],
  },

  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<600"],
  },
};

export default function () {
  userFlow(BASE_URL);
}
