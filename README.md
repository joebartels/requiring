requiring [![Build Status](https://travis-ci.org/joebartels/requiring.svg?branch=master)](https://travis-ci.org/joebartels/requiring)
=========
Main use case is to avoid errors when requiring files from **current working directory** that may not exist.
e.g. You want to build a module that reads a config file from the user's project root (*not* node_modules/my-module/ directory).

This only works on file & folder modules -not core modules or modules installed in *node_modules* directory

`npm install requiring`

`npm test`

####require a module async

```javascript
var requiring = require('requiring');

requiring.async('./cool-tool', function(err, mod) {
  if (err !== null) {
    return console.log(err);
  }
  mod.doStuff();
});
```

####require a module sync

```javascript
var coolTool = requiring.sync('./cool-tool'); // undefined if there is no 'cool-tool'

// pass a default value to return if no module is found
var configFile = requiring.sync('./config-file', {}); //returns {} if there is no 'config-file'
```

####other info

This utility attempts to resolve using a full path so `requiring('./cool-tool');` turns into something like this  `requiring('/Users/johndoe/projects/my-project/cool-tool');`

It will validate the path before requiring the module. If no file extension is given, it validates the path in this order: `./cool-tool`, `./cool-tool.js`, `./cool-tool.json`, `./cool-took.node`

for the case of `./cool-tool` This utility will leverage node's module loading pattern and look for *./cool-tool/index.js* or the `main` file defined in *./cool-tool/package.json* 

requiring a module async is really just validating the path async, then requiring the module sync.

All paths passed to `requiring(path)` are looked for **relative** to the **current working directory** 
