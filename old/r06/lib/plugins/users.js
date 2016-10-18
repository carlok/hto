'use strict';

const Boom = require('boom');
const Joi = require('joi');

exports.register = function (server, options, next) {

    const fooHandler = function FooHandler(request, reply) {

        let response = {};

        if (request.params.imei === '1234') {
            response = { hi: 'world ' + request.params.imei };
        }
        else {
            response = Boom.badRequest('not 1234', request.params.imei);
        }

        return reply(response);
    };

    server.route({
        method: 'GET',
        path: '/foo/{imei}',
        config: {
            validate: {
                params: {
                    imei: Joi.string().min(4).max(5)
                },
                query: false,
                payload: false
            },
            handler: fooHandler,
            description: 'Our foo API',
            tags: ['api']
        }
    });

    server.route({
        method: 'GET',
        path: '/token_free',
        handler: function (request, reply) {

            return reply({ hi: 'world' });
        }
    });

    server.route({
        method: 'GET',
        path: '/restricted',
        handler: function (request, reply) {

            reply({ message: 'You used a Valid JWT Token to access /restricted endpoint!' })
                .header('Authorization', request.headers.authorization);
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
