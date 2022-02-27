const path = require('path');
const withSass = require('@zeit/next-sass');

module.exports = withSass({
  /* bydefault config  option Read For More Optios
  here https://github.com/vercel/next-plugins/tree/master/packages/next-sass
  */
  cssModules: true
})

module.exports = {
    env: {
      host: 'http://localhost:3000/',
    },
    target: 'serverless',
    sassOptions: {
      includePaths: [path.join(__dirname, 'styles')],
    },
    webpack: (config) => {
      config.resolve.alias = {
        ...config.resolve.alias,
      };
      return config;
    }
  }