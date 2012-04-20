var fs = require('fs');
var util = require('util');
var async = require('async');
var coffee = require('coffee-script');
var jade = require('jade');

exports.run = function(options, callback) {
  var options = options || {};
  options.path = options.path || process.cwd();
  options.output = options.output ||options.path + '/_output';
  compile(options.path, options.output, callback);
};

function compile(inputDir, outputDir, subFolder, callback) {
  if (typeof(subFolder) === 'function') {
    callback = subFolder;
    subFolder = '';
  }

  subFolder = subFolder || '';
  fs.mkdir(outputDir + subFolder, readFiles);

  function readFiles(err) {
    if (err) { return callback(err); }

    fs.readdir(inputDir + subFolder, compileFiles);
  }

  function compileFiles(err, files) {
    if (err) { return callback(err); }

    async.forEach(files, compileFile, callback);
  }

  function compileFile(filename, foreachCallback) {
    var inFile = inputDir + subFolder + '/' + filename;
    if (inFile.startsWith(outputDir)) {
      return foreachCallback();
    }
    var outFile = outputDir + subFolder + '/' + filename;
    var stats = fs.lstatSync(inFile);
    if (stats.isDirectory()) {
      compile(inputDir, outputDir, subFolder + '/' + filename, foreachCallback);
    } else if (filename.endsWith('.coffee')) {
      var compiled = coffee.compile(fs.readFileSync(inFile, 'utf-8'));
      fs.writeFileSync(switchFileExtension(outFile, 'js'), compiled, 'utf-8');
      foreachCallback();
    } else if (filename.endsWith('.jade')) {
      var fn = jade.renderFile(inFile, function(err, content) {
        if (err) { return foreachCallback(err); }
        fs.writeFileSync(switchFileExtension(outFile, 'html'), content, 'utf-8');
        foreachCallback();
      });
    } else if (filename.endsWith('.less')) {
      // TODO
      foreachCallback();
    } else {
      var newFile = fs.createWriteStream(outFile);     
      var oldFile = fs.createReadStream(inFile);
      util.pump(oldFile, newFile, foreachCallback);
    }
  }
}

function switchFileExtension(file, newExtension) {
  var index = file.lastIndexOf('.');
  if (index > 0 && index > file.length - 10) {
    return file.substring(0, index + 1) + newExtension;
  }
}

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.startsWith = function(prefix) {
    return this.substr(0, prefix.length) === prefix;
};