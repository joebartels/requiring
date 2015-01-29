'use strict';
var fs    = require('fs');
var path  = require('path');

/*
  uses the relative path to build the full path of the requested file.
  the current working directory is used as the base.
  @method buildPath
  @private
  @param {String} mod The default is './' if left blank
  @return {String}
*/
function buildPath(mod) {
  mod = mod || './';
  var dir = process.cwd();
  var fullPath = path.join(dir, mod);
  return fullPath;
}

/*
  If no file extension exists, it creates an array of possible paths:
  filePath, filePath.js, filePath.json, filePath.node
  @method possiblePaths
  @private
  @param {String} filePath
  @return {Array} an array of possible paths in the order they should be checked.
*/
function possiblePaths(filePath) {
  if (!path.extname(filePath)) {
    return [
        filePath,
        filePath+'.js',
        filePath+'.json',
        filePath+'.node'
      ];
  } else {
    return [filePath];
  }
}

/*
  attempts to resolve an actual path from an array of possible paths.
  @method actualPath
  @private
  @param {Array} possiblePaths an array of paths to check for validity
  @param {Mixed} def the default value to return if no path is valid
  @return {String} the path
  @default null
*/
function actualPath(possiblePaths, def) {
  possiblePaths = possiblePaths || [];
  def = 'undefined' !== typeof def ? def : null;

  var pathToUse = def;

  for (var i = 0; i < possiblePaths.length; i++) {
    if (fs.existsSync(possiblePaths[i])) {
      pathToUse = possiblePaths[i];
      break;
    }
  }
  return pathToUse;
}

/*
  Returns a module async through the passed callback.
  ```javascript
    var requires = require('requires');

    requires.async('./my-cool-file', function(err, mod) {
      if (err !== null) {
        mod.method();
      }
    });
  ```
  @method async
  @param {String} mod The module to require.
  @param {Function} callback The callback to use.
*/
module.exports.async = function(mod, callback) {
  mod = mod || '';
  var ret;
  var fullPath = buildPath(mod);
  var pathsToTry = possiblePaths(fullPath);
  var pathToUse = actualPath(pathsToTry, fullPath);

  return fs.realpath(pathToUse, function(err, fullPath) {
    if (err !== null) {
      return callback(err);
    } else {
      ret = require(fullPath);
      return callback(null, ret);
    }
  });
}

/*
  Returns a module synchronously. Returns def param if none is found.
  @method sync
  @param {String}
*/
module.exports.sync = function(mod, def) {
  mod = mod || '';
  var fullPath = buildPath(mod);
  var pathsToTry = possiblePaths(fullPath);
  var pathToUse = actualPath(pathsToTry)

  if (pathToUse !== null) {
    return require(pathToUse);
  } else {
    return def;
  }
}
