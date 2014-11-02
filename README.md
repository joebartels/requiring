requiring
=========
Main use case is to avoid errors when requiring local files that may not exist.

This only works on local files -not core modules or modules installed in *node_modules* directory

`npm install requiring`

`npm test`
#####require a module async
```javascript
var requiring = require('requiring');

requiring.async('./cool-tool', function(err, mod) {
  if (err !== null) {
    return console.log(err);
  }
  mod.doStuff();
});
```

#####require a module sync
```javascript
var coolTool = requiring.sync('./cool-tool'); // undefined if there is no 'cool-tool'
```

#####other info
This utility attempts to resolve using a full path so `requiring('./cool-tool');` turns into something like this  `requiring('/Users/johndoe/projects/my-project/cool-tool');`

It will validate the path before requiring the module. If no file extension is given, it validates the path in this order: `./cool-tool`, `./cool-tool.js`, `./cool-tool.json`, `./cool-took.node`

requiring a module async is really just validating the path async, then requiring the module sync. 
