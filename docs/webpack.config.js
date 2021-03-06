module.exports = {
  mode: 'development',
  // mode: 'production',
  entry: {
    app: ['./js/app.js'],
    worker: ['./js/worker.js'],
    workerSAB: ['./js/workerSAB.js'],
    workerSABPM: ['./js/workerSABPM.js'],
    workerSABAtomics: ['./js/workerSABAtomics.js'],
    workerSABTest: ['./js/workerSABTest.js'],
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
  },
}