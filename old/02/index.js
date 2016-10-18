'use strict';

const Blipp = require('blipp');
const Env = require('node-env-file');
const Hapi = require('hapi');
const Mdb = require('./plugins/mdb.js');
const Users = require('./plugins/users.js');

const server = new Hapi.Server();

process.env.SERVER_ENV !== 'production' ? Env(__dirname + './../.env') : null;

server.connection({ host: process.env.HOST, port: process.env.PORT });

server.register([
    { register: Mdb, options: {}, routes: { prefix: process.env.PREFIX } },
    { register: Users, options: {}, routes: { prefix: `${process.env.PREFIX}/users` } },
    Blipp
], (err) => {

    (err !== undefined) ? console.log(err) : null;

    server.start((serverError) => {

        (serverError !== undefined) ? console.log(serverError) : null;
        console.log(`Server running at ${server.info.uri}`);
    });
});
