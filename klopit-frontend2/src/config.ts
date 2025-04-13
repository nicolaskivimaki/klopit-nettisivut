// src/config.ts
interface Config {
  API_BASE_URL: string;
}

const getApiUrl = (): string => {
  // Use Vite's environment variable (only works if prefixed with VITE_)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Fallback to development default
  return 'http://localhost:5001/api';
};

const config: Config = {
  API_BASE_URL: getApiUrl(),
};

export default config;
