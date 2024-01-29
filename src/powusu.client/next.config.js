/** @type {import('next').NextConfig} */


const isDev = process.env.NODE_ENV == "development";

const withSerwist = require("@serwist/next").default({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: isDev,
});

module.exports = withSerwist({
  env: {
    SERVER_URL: process.env.SERVER_URL
  },
  reactStrictMode: false
});
