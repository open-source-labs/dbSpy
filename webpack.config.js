const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: './client/index.tsx',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  devtool: 'eval-source-map', //comment it out when doing the production run 
  devServer: {
    host: 'localhost',
    port: 8080,
    hot: true,
    proxy: {
      '/api/**': {
        target: 'http://localhost:3000',
        secure: false
      },
      '/page/**': {
        target: 'http://localhost:3000',
        secure: false
      },
      '/auth/**': {
        target: 'http://localhost:3000',
        secure: false
      },
      '/protected': {
        target: 'http://localhost:3000',
        secure: false
      },
      '/logout': {
        target: 'http://localhost:3000',
        secure: false
      },
      '/google/**': {
        target: 'http://localhost:3000',
        secure: false
      },
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
        use: ['url-loader?limit=8192'] 
      },
      { 
        test: /\.tsx?$/, 
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({
    template: 'index.html'
  })],
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  }
};

