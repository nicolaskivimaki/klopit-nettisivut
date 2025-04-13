// Configuration
interface Config {
  API_BASE_URL: string;
}

// Handle process.env access in a type-safe way
declare global {
  interface Window {
    env?: {
      REACT_APP_API_URL?: string;
    };
  }
}

const getApiUrl = (): string => {
  // Try to get from window.env (for runtime configuration)
  if (window?.env?.REACT_APP_API_URL) {
    return window.env.REACT_APP_API_URL;
  }

  // Try to get from environment variables (for build-time configuration)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Fallback to hardcoded development URL (Check if your backend is running on 5001)
  return 'http://localhost:5001/api';
};

const config: Config = {
  API_BASE_URL: getApiUrl(),
};

export default config;
