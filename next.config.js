/** @type {import('next').NextConfig} */
module.exports = {
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.steamstatic.com",
        port: "",
        pathname: "/**"
      }
    ]
  }
};
