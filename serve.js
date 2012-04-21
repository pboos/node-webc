var publisher = require('./index');

var dataPath = __dirname + '/test/_data';
var outputPath = dataPath + '/_output';

publisher.serve({ path: dataPath, output: outputPath, port: 8080 }, function(err, runner) {
  console.log('Running on http://localhost:8080');
});