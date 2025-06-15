export interface Environment {
  production: boolean;
  apiUrl: string;
  apiTimeoutMs: number;
  enableDebugLogging: boolean;
}

const development: Environment = {
  production: false,
  apiUrl: 'https://localhost:7206/api',
  // apiUrl: 'http://localhost:5252/api', // Alternative HTTP URL
  apiTimeoutMs: 30000,
  enableDebugLogging: true,
};

const production: Environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api',
  apiTimeoutMs: 10000,
  enableDebugLogging: false,
};

// Determine current environment
const getEnvironment = (): Environment => {
  const hostname = window.location.hostname;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return development;
  }

  return production;
};

export const environment = getEnvironment();

// Debug helper
export const debugLog = (message: string, data?: any) => {
  if (environment.enableDebugLogging) {
    console.log(`[DEBUG] ${message}`, data);
  }
};
