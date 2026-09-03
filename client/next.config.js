/** @type {import('next').NextConfig} */
module.exports = {
  turbopack: {
    watchOptions: {
      pollIntervalMs: 300,
    },
  },
  allowedDevOrigins: ['ticketing.dev'],
};