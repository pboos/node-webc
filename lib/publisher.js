var fs = require('fs');
var util = require('util');
var async = require('async');
var coffee = require('coffee-script');
var jade = require('jade');
var recess = require('recess');

exports.run = function(options, callback) {
  var options = options || {};
  options.path = options.path || process.cwd();
  options.output = options.output || options.path + '/_output';
  compile(options.path, options.output, { ignore: [options.output] }, callback);
};

function compile(inputPath, outputPath, options, callback) {
  options = options || {};
  options.ignore = options.ignore || [];

  for (var i = 0; i < options.ignore.length; i++) {
    if (inputPath.startsWith(options.ignore[i])) {
      return callback();
    }
  };

  var stats = fs.lstatSync(inputPath);
  if (stats.isDirectory()) {
    compileFolder(inputPath, outputPath, options, callback);
  } else {
    compileFile(inputPath, outputPath, options, callback);
  }
}

function compileFolder(inputDir, outputDir, options, callback) {
  fs.mkdir(outputDir, readFiles);
  function readFiles(err) {
    if (err) { return callback(err); }

    fs.readdir(inputDir, handleFiles);
  }

  function handleFiles(err, files) {
    if (err) { return callback(err); }

    async.forEach(files, handleFile, callback);
  }

  function handleFile(filename, foreachCallback) {
    var inputFile = inputDir + '/' + filename;
    var outputFile = outputDir + '/' + filename
    compile(inputFile, outputFile, options, foreachCallback);
  }
}

function compileFile(inputFile, outputFile, options, callback) {
  if (inputFile.endsWith('.coffee')) {
    var compiled = coffee.compile(fs.readFileSync(inputFile, 'utf-8'));
    writeToFile(compiled, 'js', callback);
  } else if (inputFile.endsWith('.jade')) {
    var fn = jade.renderFile(inputFile, function(err, content) {
      if (err) { return callback(err); }
      writeToFile(content, 'html');
    });
  } else if (inputFile.endsWith('.less')) {
    recess([inputFile], { compile: true }, function(err, obj) {
      if (err) { return callback(err); }
      writeToFile(obj.output[0], 'css');
    });
  } else {
    var inputFileDescriptor = fs.createReadStream(inputFile);
    var outputFileDescriptor = fs.createWriteStream(outputFile);
    util.pump(inputFileDescriptor, outputFileDescriptor, callback);
  }

  function writeToFile(content, extension) {
      fs.writeFileSync(switchFileExtension(outputFile, extension), content, 'utf-8');
      callback();
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