const path = require('path');

module.exports = {
  entry: './out/extension.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    vscode: 'commonjs vscode'
  },
  mode: 'production',
  optimization: {
    minimize: true
  }
}; 