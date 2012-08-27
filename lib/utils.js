var Q = require('q');

// filter([a, b, c], fn); //where fn returns a promise
//  => [A, C]
module.exports.filter = filter;
function filter(arr, fn) {
    return map(arr, function (element) {
        return Q.when(fn(element), function (res) {
            return {element: element, res: res};
        });
    })
    .then(function (arr) {
        return arr.filter(function (obj) {
            return obj.res;
        }).map(function (obj) {
            return obj.element;
        });
    });
}

// map([a, b, c], fn); //where fn returns a promise
//  => [A, B, C]
module.exports.map = map;
function map(arr, fn) {
    return Q.when(arr, function (arr) {
        return Q.all(arr.map(function (elem) {
            return fn(elem);
        }));
    });
}

// merge(A)
// -> {into(B), from(B)}
// 
// e.g.
//      merge({a: 1, b: 1}).into({a: 2});
//      // -> {a: 1, b: 1}
//      
//      merge({a: 1, b: 1}).from({a: 2});
//      // -> {a: 2, b: 1}
module.exports.merge = merge;
function merge(A) {
    return {
        into: function (B) {
            mergeSimple(A, B);
        },
        from: function (B) {
            mergeSimple(B, A);
        }
    };
}

// mergeSimple(from, to)
//  -> {from + to} //where `from` overrides `to`
function mergeSimple(from, to) {
    if (from) {
        Object.keys(from).forEach(function (key) {
            to[key] = from[key];
        });
    }
    return to;
}

// reverse([1, 2, 3])
//  -> [3, 2, 1]
module.exports.reverse = reverse;
function reverse(arr) {
    var out = [];
    for (var i = arr.length - 1; i >= 0; i--) {
        out.push(arr[i]);
    }
    return out;
}