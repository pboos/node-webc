var publisher = require('./index');

var dataPath = __dirname + '/test/_data';
var outputPath = dataPath + '/_output';

publisher.run({ path: dataPath, output: outputPath }, function(err, runner) {
  console.log('Running...');
});