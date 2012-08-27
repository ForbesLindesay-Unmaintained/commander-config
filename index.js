var path = require('path');
var Q = require('q');
var yaml = require('js-yaml');

// {exists, read}
var fs = require('./lib/fs');
// {filter, map, merge, reverse}
var utils = require('./lib/utils');

// exists(path);
//  => bool
var exists = fs.exists;
// read(path, [encoding]);
//  => string
var read = fs.read;

// map(Array, fn)
//  => MappedArray
var map = utils.map;
// filter(Array, fn)
//  => FilteredArray
var filter = utils.filter;
// merge(from).into(to);
// merge(to).from(from);
var merge = utils.merge;
// reverse([1, 2, 3])
//  -> [3, 2, 1]
var reverse = utils.reverse;

// @api private (used for unit testing)
module.exports.workingDirectory = './';

// lookUpSettings(relativePath);
//  => {result of recursive settings lookup merged}
//  
// @api public
module.exports.lookUpSettings = lookUpSettings;
function lookUpSettings(relativePath) {
    var dir = path.resolve(module.exports.workingDirectory);
    var paths = [];
    paths.push(path.join(dir, relativePath) + '.json');
    paths.push(path.join(dir, relativePath) + '.yml');
    paths.push(path.join(dir, relativePath) + '.yaml');
    while (path.join(dir, '..') !== dir) {
        dir = path.join(dir, '..');
        paths.push(path.join(dir, relativePath) + '.json');
        paths.push(path.join(dir, relativePath) + '.yml');
        paths.push(path.join(dir, relativePath) + '.yaml');
    }
    paths = reverse(paths);
    paths = filter(paths, exists);
    var files = map(paths, load);
    return files.then(function (files) {
        var current = {};
        for (var i = 0; i < files.length; i++) {
            merge(files[i]).into(current);
        }
        return current;
    });
}

// load(path);
//  => {resulting object}
function load(path) {
    return read(path).then(function (str) {
        if (/\.json$/.test(path)) {
            return JSON.parse(str);
        } else if (/\.ya?ml$/.test(path)) {
            return yaml.load(str);
        }
    });
}

// withSettings(relativePath, cb)
//  -> fn
// 
// Settings are merged into the first argument to the callback
// 
// @api public
module.exports.withSettings = withSettings;
function withSettings(relativePath, cb) {
    return function withSettings() {
        var args = arguments;
        var self = this;
        lookUpSettings(relativePath).then(function (settings) {
            merge(args[0]).into(settings);
            args[0] = settings;
            cb.apply(self, args);
        }).end();
    };
}