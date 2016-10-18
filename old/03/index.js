'use strict';

const Glue = require('glue');
const Env = require('node-env-file');

process.env.SERVER_ENV !== 'production' ? Env(__dirname + './../.env') : null;

const manifest = {
    server: {},
    connections: [
        { host: process.env.HOST, port: process.env.PORT }
    ],
    registrations: [
        { plugin: { register: './plugins/mdb.js' }, options: { routes: { prefix: process.env.PREFIX } } },
        { plugin: { register: './plugins/users.js' }, options: { routes: { prefix: `${process.env.PREFIX}/users` } } },
        { plugin: { register: 'blipp' } }
    ]
};

Glue.compose(manifest, { relativeTo: __dirname }, (err, server) => {

    if (err) {
        throw err;
    }

    server.start((err) => {

        (err !== undefined) ? console.log(err) : null;
        console.log(`Server running at ${server.info.uri}`);
    });
});
