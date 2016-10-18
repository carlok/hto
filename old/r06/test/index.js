'use strict';

const Code = require('code');
const Env = require('node-env-file');
const Lab = require('lab');

const Server = require('../lib/index.js');
const lab = exports.lab = Lab.script();

process.env.SERVER_ENV !== 'production' ? Env(__dirname + './../../.env') : null;

lab.test('It will return {hi: "world"}', (done) => {

    Server.inject(`${process.env.PREFIX}/users/token_free`, (res) => {

        Code.expect(res.statusCode).to.equal(200);
        Code.expect(res.result).to.equal({ hi: 'world' });
        done();
    });
});

lab.test('It will return {hi: "world 1234"}', (done) => {

    Server.inject(`${process.env.PREFIX}/users/foo/1234`, (res) => {

        Code.expect(res.statusCode).to.equal(200);
        Code.expect(res.result).to.equal({ hi: 'world 1234' });
        done();
    });
});

lab.test('It will return 400', (done) => {

    Server.inject(`${process.env.PREFIX}/users/foo/12345`, (res) => {

        Code.expect(res.statusCode).to.equal(400);
        Code.expect(res.result).to.equal({
            'error': 'Bad Request',
            'message': 'not 1234',
            'statusCode': 400
        });
        done();
    });
});
