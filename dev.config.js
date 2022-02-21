const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { ESBuildMinifyPlugin } = require('esbuild-loader');

module.exports = {
  // Where files should be sent once they are bundled
  output: {
    path: path.join(__dirname, "/docs"),
    filename: "[name].[chunkhash].js",
  },
  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    alias: {
      react: path.join(__dirname, 'node_modules', 'react'),
    },
  },
  // webpack 5 comes with devServer which loads in development mode
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 9000,
  },
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       vendors: {
  //         test: /node_modules\/(?!antd\/).*/,
  //         name: "vendors",
  //         chunks: "all",
  //       },
  //     },
  //   },
  //   runtimeChunk: {
  //     name: "manifest",
  //   },
  //   mergeDuplicateChunks: true,
  // },
  devtool: "source-map",
  // Rules of how webpack will take our files, complie & bundle them for the browser
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /nodeModules/,
        loader: 'esbuild-loader',
        options: {
          loader: 'jsx',
          target: 'es2015'
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jpg|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./src/index.html", favicon: "./src/favicon.ico" }),
    new MiniCssExtractPlugin(),
    // new webpack.DefinePlugin({ //<--key to reduce React's size
    //   'process.env': {
    //     'NODE_ENV': JSON.stringify('production')
    //   }
    // }),
    // new webpack.optimize.AggressiveMergingPlugin(),
    // new CompressionPlugin({test: /\.js(\?.*)?$/i}),
  ],
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'es2015',
        css: true
      })
    ]
  },
  // performance: {
  //   hints: "warning",
  //   // Calculates sizes of gziped bundles.
  //   assetFilter: function (assetFilename) {
  //     return assetFilename.endsWith(".js.gz");
  //   },
  // }
};
