const fs = require('fs');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");


const babelOptions = {
  // Use all installed plugins
  plugins: Object.keys(JSON.parse(fs.readFileSync(__dirname + '/package.json')).devDependencies)
    .filter((a) => a.startsWith('babel-plugin-'))
    .map((a) => a.slice(13))
};

const sassOptions = {};

module.exports = {
  mode: 'development',
  plugins: [
    new ExtractTextPlugin('bundle.css'),
    new (require('html-webpack-plugin'))({
      filename: 'index.html',
      template: 'src/index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions
        }
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: sassOptions
            }
          ]
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'postcss-loader'
          ]
        })
      },
      {
        test: /\.(?:woff|woff2|eot|ttf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/'
          }
        }
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            loaders: {
              js: {
                loader: 'babel-loader',
                options: babelOptions
              },
              css: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                  'css-loader',
                  'postcss-loader'
                ]
              }),
              scss: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                  'css-loader',
                  'postcss-loader',
                  {
                    loader: 'sass-loader',
                    options: sassOptions
                  },
                  {
                    loader: 'sass-resources-loader',
                    options: {
                      resources: [
                        'src/styles/_shared.scss'
                      ]
                    }
                  }
                ]
              })
            }
          }
        }
      },
      {
        test: /\.yaml$/,
        use: ['json-loader', 'yaml-loader']
      }
    ]
  },
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
