const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },

  devtool: 'eval-source-map',

  resolve: {
    alias: {
      firebase: path.resolve(__dirname, 'node_modules/firebase'),
    },
  },
};