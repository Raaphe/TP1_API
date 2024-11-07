import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT,
  ENV: process.env.NODE_ENV,
  SESSION_SECRET: process.env.SESSION_SECRET,
  JWT_SECRET: process.env.JWT_SECRET ?? "42",
  CERT_KEY: process.env.CERT_KEY_PATH,
  CERT_CERT: process.env.CERT_CERT_PATH,
  CLUSTER_URL : process.env.CLUSTER_URI,
};