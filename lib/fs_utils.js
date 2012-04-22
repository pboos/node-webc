var path  = require('path')
  , fs    = require('fs')
  , async = require('async');

exports.deletePath = function(pathToDelete, callback) {
  callback = callback || function(){};
  
  path.exists(pathToDelete, existsCallback);

  function existsCallback(exists) {
    if (exists) {
      fs.lstat(pathToDelete, lstatCallback);
    } else {
      callback();
    }
  }

  function lstatCallback(err, stats) {
    if (err) { return callback(err); }

    if (stats.isDirectory()) {
      fs.readdir(pathToDelete, deleteDirectoryContent);
    } else {
      fs.unlink(pathToDelete, callback);
    }
  }

  function deleteDirectoryContent(err, files) {
    if (err) { return callback(); }

    async.forEach(files, deleteFile, removeDirectory);
  }

  function deleteFile(file, forEachCallback) {
    exports.deletePath(pathToDelete + '/' + file, forEachCallback);
  }

  function removeDirectory(err) {
    fs.rmdir(pathToDelete, callback);
  }
}