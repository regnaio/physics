module.exports = {
  // mode: 'development',
  mode: 'production',
  entry: {
    app: ['./js/app.js'],
    worker: ['./js/worker.js']
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
  },
}