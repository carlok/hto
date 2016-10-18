'use strict';

const Blipp = require('blipp');
const Env = require('node-env-file');
const Hapi = require('hapi');
const Hello = require('./plugins/hello.js');

const server = new Hapi.Server();

Env(__dirname + '/../.env');

server.connection({ host: process.env.HOST, port: process.env.PORT });

server.register([
    { register: Hello, options: {}, routes: { prefix: process.env.PREFIX } },
    Blipp
], (err) => {

    (err !== undefined) ? console.log(err) : null;

    server.start((serverError) => {

        (serverError !== undefined) ? console.log(serverError) : null;
        console.log(`Server running at ${server.info.uri}`);
    });
});
