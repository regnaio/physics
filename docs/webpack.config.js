module.exports = {
  mode: 'development',
  // mode: 'production',
  entry: [
    './js/app.js',
  ],
  output: {
    path: __dirname + '/dist',
    filename: 'app.js',
  },
}