const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: './client/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  devServer: {
    proxy: {
      '/api/**': 'http://localhost:3000',
    },
    static: {
      directory: path.join(__dirname, 'dist'),
      publicPath: '/dist'
    },
    historyApiFallback: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.scss?/,
        use: ['style-loader', 'css-loader',  'sass-loader']
      },
      { 
        test: /\.(png|jpg)$/, 
        use: ['url-loader?limit=8192'] }
    ]
  },
  plugins: [new HtmlWebpackPlugin({
    template: 'index.html'
  })]
};

