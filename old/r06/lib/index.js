'use strict';

const Blipp = require('blipp');
const Env = require('node-env-file');
const Hapi = require('hapi');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');

// ours
const Mdb = require('./plugins/mdb.js');
const Users = require('./plugins/users.js');

process.env.SERVER_ENV !== 'production' ? Env(__dirname + './../../.env') : null;

const server = new Hapi.Server();

server.connection({ host: process.env.HOST, port: process.env.PORT });

server.register([
    { register: Mdb, options: {}, routes: { prefix: process.env.PREFIX } },
    { register: Users, options: {}, routes: { prefix: `${process.env.PREFIX}/users` } },
    Blipp,
    HapiSwagger,
    Inert,
    Vision
], (err) => {

    (err !== undefined) ? console.log(err) : null;

    // https://github.com/hapijs/glue/issues/14
    if (!module.parent) {

        server.start((serverError) => {

            (serverError !== undefined) ? console.log(serverError) : null;
            console.log(`Server running at ${server.info.uri}`);
        });
    }
    else {
        module.exports = server;
    }
});
