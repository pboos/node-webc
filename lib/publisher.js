var fs = require('fs');
var path = require('path');
var util = require('util');
var async = require('async');
var underscore = require('underscore');
var coffee = require('coffee-script');
var jade = require('jade');
var recess = require('recess');
var fsUtils = require('./fs_utils');

exports.compile = function(options, callback) {
  var options = generateOptions(options);
  callback = callback || function(){};

  fsUtils.deletePath(options.output, doCompile);

  function doCompile(err) {
    compile(options.path, options.output, options, callback);
  }
};

exports.run = function(options, callback) {
  var options = generateOptions(options);

  options.extension = function(inputPath, outputPath) {
    if (!fs.lstatSync(inputPath).isDirectory()) { return; }

    var watcher = fs.watch(inputPath, function(event, filename) {
      var sourcePath = inputPath + '/' + filename;
      var targetPath = outputPath + '/' + filename;
      if (!isInIgnore(sourcePath, options)) {
        if (path.existsSync(sourcePath)) {
          var newOptions = underscore.clone(options);
          newOptions.path = sourcePath;
          newOptions.output = targetPath;
          exports.compile(newOptions);
        } else {
          fsUtils.deletePath(targetPath);
        }
      }
    });
  };

  exports.compile(options, callback);
};

exports.serve = function(options, callback) {
  var options = generateOptions(options);
  var connect = require('connect');
  connect()
    .use(connect.static(options.output))
    .listen(options.port || 3000);
  exports.run(options, callback);
}

function generateOptions(options) {
  var options = options || {};
  options.path = options.path || process.cwd();
  options.output = options.output || options.path + '/_output';
  options.ignore = options.ignore || [];
  options.ignore.push(options.output);
  return options;
}

function compile(inputPath, outputPath, options, callback) {
  if (isInIgnore(inputPath, options)) {
    return callback();
  }

  var stats = fs.lstatSync(inputPath);
  handleExtension(inputPath, outputPath, options);
  if (stats.isDirectory()) {
    compileFolder(inputPath, outputPath, options, callback);
  } else {
    compileFile(inputPath, outputPath, options, callback);
  }
}

function isInIgnore(path, options) {
  for (var i = 0; i < options.ignore.length; i++) {
    if (path.startsWith(options.ignore[i])) {
      return true;
    }
  };
  return false;
}

function handleExtension(inputPath, outputPath, options) {
  if (options.extension) {
    options.extension(inputPath, outputPath);
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
    var outputFile = outputDir + '/' + filename;
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