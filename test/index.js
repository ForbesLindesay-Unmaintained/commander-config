var assert = require('should');
var Q = require('q');

var lib = require('..');
var folder = __dirname + '/subA/subB/subC';

lib.workingDirectory = folder;

describe('look up settings', function () {
  describe('return value', function () {
    it('contains the correct results', function (done) {
      lib.lookUpSettings('./settings')
        .then(function (settings) {
          settings.a.should.equal('hi');
          settings.b.should.equal('forbes');
          settings.c.should.equal('foo');
          settings.d.should.equal('bar');
          done();
        }, done)
        .end();
    });
  });
});

describe('commander `withSettings`', function () {
  describe('calling the result with a few arguments', function () {
    it('works as expected', function (done) {
      lib.withSettings('./settings', function (env, command) {
        command.should.equal('command');
        env.a.should.equal('hello');
        env.b.should.equal('forbes');
        env.c.should.equal('foo');
        env.d.should.equal('bar');
        done();
      })({a: 'hello'}, 'command');
    });
  })
});