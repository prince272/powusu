import { CreateAxiosDefaults } from "axios";

export interface ApiConfig extends CreateAxiosDefaults { }

export const apiConfig: ApiConfig = {
  baseURL: process.env.SERVER_URL,
  withCredentials: process.env.NODE_ENV != "development"
};