'use strict';

const Glue = require('glue');
const Env = require('node-env-file');

process.env.SERVER_ENV !== 'production' ? Env(__dirname + './../../.env') : null;

const people = { // our "users database"

    1: {
        id: 1,
        name: 'Jen Jones'
    }
};

// bring your own validation function
const validate = function (decoded, request, callback) {

    // do your checks to see if the person is valid
    return (!people[decoded.id]) ? callback(null, false) : callback(null, true);
};

const manifest = {
    server: {},
    connections: [
        { host: process.env.HOST, port: process.env.PORT }
    ],
    registrations: [
        { plugin: { register: './plugins/mdb.js' }, options: { routes: { prefix: process.env.PREFIX } } },
        { plugin: { register: './plugins/users.js' }, options: { routes: { prefix: `${process.env.PREFIX}/users` } } },
        { plugin: { register: 'blipp' } },
        { plugin: { register: 'hapi-auth-jwt2' } }
    ]
};

Glue.compose(manifest, { relativeTo: __dirname }, (err, server) => {

    if (err) {
        throw err;
    }

    // https://github.com/hapijs/glue/issues/14
    if (!module.parent) {

        server.auth.strategy('jwt', 'jwt', {
            key: 'NeverShareYourSecret',          // Never Share your secret key
            validateFunc: validate,            // validate function defined above
            verifyOptions: { algorithms: ['HS256'] } // pick a strong algorithm
        });
        server.auth.default('jwt');

        server.start((err) => {

            (err !== undefined) ? console.log(err) : null;
            console.log(`Server running at ${server.info.uri}`);
        });
    }
    else {
        module.exports = server;
    }
});
