'use strict';

const Blipp = require('blipp');
const Env = require('node-env-file');
const Hapi = require('hapi');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');
const JWT = require('jsonwebtoken');  // used to sign our content
const Jwt2 = require('hapi-auth-jwt2');
const Mdb = require('./plugins/mdb.js');
const Users = require('./plugins/users.js');

process.env.SERVER_ENV !== 'production' ? Env(__dirname + './../.env') : null;

const people = { // our "users database"
    1: {
        id: 1,
        name: 'Jen Jones'
    }
};

// use the token as the 'authorization' header in requests
console.log(JWT.sign(people[1], process.env.JWT_SECRET_KEY)); // synchronous

// bring your own validation function
const validate = function (decoded, request, callback) {

    console.log('decoded token: ', decoded);
    console.log('request info: ', request.info);
    console.log('user agent: ', request.headers['user-agent']);

    console.log('hello', server.plugins.mdb.getHello());

    // do your checks to see if the person is valid
    return (!people[decoded.id]) ? callback(null, false) : callback(null, true);
};

const server = new Hapi.Server();

server.connection({ host: process.env.HOST, port: process.env.PORT });

server.register([Jwt2], (err) => {

    (err !== undefined) ? console.log('Jwt2', err) : null;

    server.auth.strategy('jwt', 'jwt', {
        key: process.env.JWT_SECRET_KEY,
        validateFunc: validate,
        verifyOptions: { algorithms: ['HS256'] }
    });

    server.auth.default('jwt');
});

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
