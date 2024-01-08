/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      SERVER_URL: process.env.SERVER_URL
    },
    reactStrictMode: false,
  };
  
  module.exports = nextConfig;
  