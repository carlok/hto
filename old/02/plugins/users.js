'use strict';

const Boom = require('boom');
exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/hi',
        handler: function (request, reply) {

            return reply({ hi: 'world' });
        }
    });

    server.route({
        method: 'POST',
        path: '/login',
        handler: function (request, reply) {

            const user = server.plugins.mdb.userFind(request.payload);

            if (user.length === 0) {
                return reply(Boom.unauthorized('invalid username or password'));
            }

            return reply({ greeting: '(POST reply) Hello ' + user[0].name });
        }
    });

    next();
};

exports.register.attributes = {
    name: 'users'
};
