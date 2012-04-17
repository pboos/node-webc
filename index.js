module.exports = process.env.PUBLISHER_COV
  ? require('./lib-cov/publisher')
  : require('./lib/publisher');