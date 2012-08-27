var pathLib = require('path');
var fs = require('fs');
var Q = require('q');

// exists(path);
// => bool
module.exports.exists = function exists(path) {
    return Q.ncall(function exists(cb) {
        if (fs.exists) {
            fs.exists(path, then);
        } else {
            pathLib.exists(path, then)
        }
        function then(exists) {
            cb(null, exists);
        }
    });
}

// read(path, [encoding]);
// => string
module.exports.read = function read() {
    return Q.nbind(fs.readFile, fs).apply(fs, arguments).then(function (res) {
        return res.toString();
    });
};