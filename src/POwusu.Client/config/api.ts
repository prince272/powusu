import https from "https"; // Import the 'https' module
import { CreateAxiosDefaults } from "axios";

export interface ApiConfig extends CreateAxiosDefaults {}

const isDev = process.env.NODE_ENV == "development";

export const apiConfig: ApiConfig = {
  baseURL: process.env.SERVER_URL,
  withCredentials: true,
  httpsAgent: isDev ? new https.Agent({ rejectUnauthorized: false }) : undefined
};
