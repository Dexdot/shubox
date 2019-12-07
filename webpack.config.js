const path = require('path');
const webpack = require('webpack');

const config = {
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, './src/js/'),
      utils: path.resolve(__dirname, './src/js/helpers/utils')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'utils'
    })
  ],
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        test: /\.(js)$/
      }
    ]
  }
};

module.exports = {
  prod: { ...config, mode: 'production' },
  dev: { ...config, mode: 'development' }
};
