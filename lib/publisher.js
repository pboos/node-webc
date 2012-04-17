exports.run = function(options) {
  var options = options || {};
  options.path = options.path || process.cwd();
  
  console.log(options.path);
  return options.path;
};