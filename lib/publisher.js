var fs = require('fs');
var coffee = require('coffee-script');

exports.run = function(options) {
  var options = options || {};
  options.path = options.path || process.cwd();
  options.output = options.output ||options.path + '/_output';
  compile(options.path, options.output);
};

function compile(inputDir, outputDir) {
  fs.mkdirSync(outputDir);
  var files = fs.readdirSync(inputDir);
  for (var i = 0; i < files.length; i++) {
    var file = inputDir + '/' + files[i];
    var outFile = outputDir + '/' + files[i];
    var stats = fs.lstatSync(file);
    if (stats.isDirectory()) {
      compile(file, outFile);
    } else if (file.endsWith('.coffee')) {
      var content = fs.readFileSync(file, 'utf-8');
      console.log(content);
      var compiled = coffee.compile(content);
      //fs.writeFileSync(outFile, compiled, 'utf-8');
    } else if (file.endsWith('.jade')) {
      // TODO
    }
  };
}

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};