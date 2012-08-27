var fs = require('fs');
var Q = require('q');

// exists(path);
// => bool
module.exports.exists = function exists(path) {
    return Q.ncall(function exists(cb) {
        fs.exists(path, function (exists) {
            cb(null, exists);
        });
    });
}

// read(path, [encoding]);
// => string
module.exports.read = function read() {
    return Q.nbind(fs.readFile, fs).apply(fs, arguments).then(function (res) {
        return res.toString();
    });
};