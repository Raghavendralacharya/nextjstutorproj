/** @type {import('next').NextConfig} */
const webpack = require('webpack');
const nextConfig = {
    webpack: (cfg) => {
        cfg.plugins.push(
          new webpack.DefinePlugin({
            'process.env.BACK_END_URL': JSON.stringify(process.env.BACK_END_URL),
          })
        );
        return cfg;
    },
};

module.exports = nextConfig;
