'use strict';

const Code = require('code');
const Env = require('node-env-file');
const Lab = require('lab');

const request = require('request');

const Server = require('../lib/index.js');
const lab = exports.lab = Lab.script();

process.env.SERVER_ENV !== 'production' ? Env(__dirname + './../.env') : null;


lab.test('It will return {hello: "world"}', (done) => {

    request.get(`${process.env.PREFIX}/users/token_free`, function (error, response, body) {
        console.log(response);
        Code.expect(body).to.equal({hello: 'world'});

        Server.stop((err) => {

            console.log('Server stopped', err);
        });

        done();
    });

});

lab.test('It will return {hi: "world"}', (done) => {

    let options = {
        method: 'GET',
        url: `${process.env.PREFIX}/users/token_free`
    };

    Server.inject(options, (res) => {

        Code.expect(res.statusCode).to.equal(200);
        Code.expect(res.result).to.equal({hello: 'world'});
        done();
    });
});
