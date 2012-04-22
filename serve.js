var webc = require('./lib/webc');

var dataPath = __dirname + '/test/_data';
var outputPath = dataPath + '/_output';

webc.serve({ path: dataPath, output: outputPath, port: 8080 }, function(err) {
  if (err) { return console.log(err); }

  console.log('Running on http://localhost:8080');
});