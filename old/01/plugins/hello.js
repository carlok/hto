'use strict';

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/hi',
        handler: function (request, reply) {

            return reply({ hi: 'world' });
        }
    });

    next();
};

exports.register.attributes = {
    name: 'hello'
};
