module.exports = {
  mode: 'development',
  // mode: 'production',
  target: 'node',
  node: {
    __dirname: false,
  },
  entry: [
    './js/app.js',
  ],
  output: {
    path: __dirname + '/dist',
    filename: 'app.js',
  },
}