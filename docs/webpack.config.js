module.exports = {
  mode: 'development',
  // mode: 'production',
  entry: {
    app: ['./js/app.js'],
    worker: ['./js/worker.js'],
    workerSAB: ['./js/workerSAB.js'],
    workerSABAtomics: ['./js/workerSABAtomics.js']
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
  },
}