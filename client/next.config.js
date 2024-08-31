// module.exports = {
//   webpackDevMiddleware : config => {
//     config.watchOptions.poll = 1000;
//     return config;
//   } 
// }

module.exports = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,  // Enable polling with a 1-second interval
        aggregateTimeout: 300,  // Delay before rebuilding (in milliseconds)
      };
    }
    return config;
  },
};
