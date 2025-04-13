// src/config.ts
interface Config {
  API_BASE_URL: string;
}

const getApiUrl = (): string => {
  return 'https://klopit-nettisivut.onrender.com/api'; // TEMP: for quick test
};


const config: Config = {
  API_BASE_URL: getApiUrl(),
};

export default config;
