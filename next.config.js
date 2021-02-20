// next.config.js
// const { parsed: localEnv } = require('dotenv').config();
const webpack = require('webpack');
const withSass = require('@zeit/next-sass');

module.exports = withSass(
  {
    webpack(config) {
      // Put .env to Next.js
      // ==> https://jaketrent.com/post/environment-variables-in-nextjs/
      // config.plugins.push(new webpack.EnvironmentPlugin(localEnv));

      config.module.rules.push({
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      });
      config.node = {
        fs: 'empty'
      }

      return config;
    },
    env: {
      WALLET_API: 'http://localhost:4030',
      WEB3_API: 'https://web3-api.poc.b2p.in'
    },
  }
);