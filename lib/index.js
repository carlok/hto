'use strict';

// third parties
const Blipp = require('blipp');
const Env = require('node-env-file');
const Hapi = require('hapi');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');
const Jwt2 = require('hapi-auth-jwt2');

// my extensions
const OnPreResponse = require('./extensions/onpreresponse.js');

// my plugins
const Mcrypt = require('./plugins/mcrypto.js');
const Mdb = require('./plugins/mdb.js');
const Users = require('./plugins/users.js');

process.env.SERVER_ENV !== 'production' ? Env(__dirname + './../.env') : null;

const server = new Hapi.Server();

server.connection({ host: process.env.HOST, port: process.env.PORT });

server.register([
    Blipp,
    HapiSwagger,
    Inert,
    Jwt2,
    Vision,

    { register: OnPreResponse, options: {}, routes: { prefix: process.env.PREFIX } },

    { register: Mcrypt, options: {}, routes: { prefix: process.env.PREFIX } },
    { register: Mdb, options: { jwt_skey: process.env.JWT_SECRET_KEY }, routes: { prefix: process.env.PREFIX } }
], (err) => {

    (err !== undefined) ? console.log('Jwt2', err) : null;

    server.auth.strategy('jwt', 'jwt', {
        key: process.env.JWT_SECRET_KEY,
        validateFunc: server.plugins.mdb.userValidate,
        verifyOptions: { algorithms: ['HS256'], ignoreExpiration: false }
    });

    server.auth.default('jwt');
});

server.register([
    { register: Users, options: {}, routes: { prefix: `${process.env.PREFIX}/users` } }
], (err) => {

    (err !== undefined) ? console.log(err) : null;
});

server.app.decrypt_input = process.env.DECRYPT_INPUT;
server.app.encrypt_output = process.env.ENCRYPT_OUT;

server.start((serverError) => {

    (serverError !== undefined) ? console.log(serverError) : null;
    console.log(`Server running at ${server.info.uri}`);
});

module.exports = server;
