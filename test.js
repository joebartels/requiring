'use strict';
var assert = require('assert');
var requiring = require('./');

it('requiring.sync should return undefined when no module exists and no default param passed', function() {
  var testModule = requiring.sync('./dontexist');

  assert.deepEqual(testModule, undefined, 'Module not found and returns undefined');
});

it('requiring.sync should return default value when no module exists and a default param is passed', function() {
  var testModule = requiring.sync('./dontexist', 'no module here');

  assert.deepEqual(typeof testModule, 'string', 'Module not found and returns the correct default type');
  assert.deepEqual(testModule, 'no module here', 'Module not found and returns default value');
});

it('requiring.sync should return the module if it exists', function() {
  var testModule = requiring.sync('./tests/dummy');
  var ret = testModule();

  assert.deepEqual(typeof testModule, 'function', 'The module is a function');
  assert.deepEqual(ret, 'I am a dummy', 'The correct module is returned');
});

it('requiring.sync should return the main file from the package.json', function() {
  var testModule = requiring.sync('./tests');
  var ret = testModule();

  assert.deepEqual(typeof testModule, 'function', 'The module is a function');
  assert.deepEqual(ret, 'I am the main file', 'The correct module is returned');
});

it('requiring.async should return an error in the callback when no module exists', function(done) {
  requiring.async('./dontexist', function(err, testModule) {

    assert.notDeepEqual(err, null, 'Callback recieves an error');
    assert.deepEqual(testModule, undefined, 'Callback does not recieve a module');
    done();
  });
});

it('requiring.async should return a module in the callback when module exists', function(done) {
  requiring.async('./tests/dummy', function(err, testModule) {
    var ret = testModule();

    assert.ifError(err);
    assert.deepEqual(typeof testModule, 'function', 'The module is a function');
    assert.deepEqual(ret, 'I am a dummy', 'Callback recieves the correct module');
    done();
  });
});

it('requiring.async should return the main file from package.json in the callback', function(done) {
  requiring.async('./tests', function(err, testModule) {
    var ret = testModule();

    assert.ifError(err);
    assert.deepEqual(typeof testModule, 'function', 'The module is a function');
    assert.deepEqual(ret, 'I am the main file', 'Callback recieves the correct module');
    done();
  });
});
