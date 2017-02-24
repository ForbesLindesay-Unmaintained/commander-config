[![Build Status](https://secure.travis-ci.org/ForbesLindesay/commander-config.png?branch=master)](http://travis-ci.org/ForbesLindesay/commander-config)
commander-config
================

[![Greenkeeper badge](https://badges.greenkeeper.io/ForbesLindesay/commander-config.svg)](https://greenkeeper.io/)

Recursively walks up directories from the current directory to look for settings files to provide defaults for commander.js

If you run your app in `/foo/bar/baz/` and use the relative path `.boz` then commander-config would try:

 - `/foo/bar/baz/.boz.json`
 - `/foo/bar/baz/.boz.yaml`
 - `/foo/bar/baz/.boz.yml`
 - `/foo/bar/.boz.json`
 - `/foo/bar/.boz.yaml`
 - `/foo/bar/.boz.yml`
 - `/foo/.boz.json`
 - `/foo/.boz.yaml`
 - `/foo/.boz.yml`
 - `/.boz.json`
 - `/.boz.yaml`
 - `/.boz.yml`

It will then merge any settings it finds such that the ones at the top of that list override the ones at the bottom.

## API

### lookUpSettings(relativePath)

Looks up settings relative to the current directory, and relative to each parent directory of the current directory.  Child directories take priority over parent directories and the settings are merged in using a shallow merge.  The return value is a promise.

```javascript
var settings = require('comander-config').lookUpSettings('.myCrazyApp');
settings.then(console.log).end();
```

### withSettings(relativePath, cb)

When used with commander this will merge settings into the env parameter of the function.

```javascript
var program = require('commander');
var config = require('commander-config');
program
  .command('run [name]')
  .action(config.withSettings('.myCrazyApp', function (name, env) {

  }));
```