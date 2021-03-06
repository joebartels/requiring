'use strict';
var fs    = require('fs');
var path  = require('path');

/*
  Determines if file exists and can be read with calling process
  @method canReadFile
  @private
  @param {String} filePath the path to test for read access
  @return {String}
*/
function canReadFile(filePath) {
  var exists;

  if (fs.accessSync) {

    try {
      exists = 'undefined' === typeof fs.accessSync(filePath, fs.R_OK);
    } catch (error) {
      exists = false;
    }

  // node 0.10
  } else {
    exists = fs.existsSync(filePath);
  }

  return exists;
}

/*
  uses the relative path to build the full path of the requested file.
  the current working directory is used as the base.
  @method buildPath
  @private
  @param {String} mod The default is './' if left blank
  @param {Object} options Options passed
  @return {String}
*/
function buildPath(mod, baseDirectory) {
  mod = mod || './';

  if (baseDirectory) {
    var absolutePath = path.resolve(baseDirectory);
  }

  var dir = absolutePath || process.cwd();
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

    if (canReadFile(possiblePaths[i])) {
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
module.exports.async = function(mod, options, callback) {
  mod = mod || '';

  if (arguments.length === 2) {
    callback = options;
    options = {};
  }

  var ret;
  var fullPath = buildPath(mod, options.directory);
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

// sync('path', {directory: 'Users'}, {});
// sync('path', {directory: 'Users'});
// sync('path', {});
// sync('path');

/*
  Returns a module synchronously. Returns def param if none is found.

  @method sync
  @param {String}
  @param {Object} options 
  @param {Mixed} def The default object to return (can be any type);
*/
module.exports.sync = function(mod, options, def) {
  mod = mod || '';
  options = options || {};

  if (arguments.length === 1) {
    options = {};
  }

  // hacky duck typing TODO: remove in 0.1.0
  if (arguments.length === 2 && options && !options.directory) {
    def = options;
  }

  var fullPath = buildPath(mod, options.directory);
  var pathsToTry = possiblePaths(fullPath);
  var pathToUse = actualPath(pathsToTry)

  if (pathToUse !== null) {
    return require(pathToUse);
  } else {
    return def;
  }
}
