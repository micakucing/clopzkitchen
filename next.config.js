module.exports = {
  images: {
    domains: ['imgur.com'],
  },
   poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  type: "route",
  compiler: {
    removeConsole: true,
  },
  
  webpack(config, { nextRuntime }) {
    // as of Next.js latest versions, the nextRuntime is preferred over `isServer`, because of edge-runtime
    if (typeof nextRuntime === "undefined") {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    return config;
  } 
};
