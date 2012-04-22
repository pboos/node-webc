var webc = require('./lib/webc');

var dataPath = __dirname + '/test/_data';
var outputPath = dataPath + '/_output';

webc.watch({ path: dataPath, output: outputPath }, function(err, runner) {
  if (err) { return console.log(err); }
  
  console.log('Running...');
});