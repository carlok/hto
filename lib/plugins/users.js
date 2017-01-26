'use strict';

const Boom = require('boom');
const Joi = require('joi');

exports.register = function (server, options, next) {

    const pre1 = function (request, reply) {

        const joiSchema = Joi.object().keys({
            username: Joi.string().email(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
        });

        let payloadClear = {};

        if (request.server.app.decrypt_input == 1) {
            payloadClear = JSON.parse(server.plugins.mcrypt.decrypt(request.payload.p));
        } else {
            payloadClear = request.payload;
        }

        Joi.validate(payloadClear, joiSchema, (err, value) => {
            if (err) {
                console.log("err = " + err);
                return reply(Boom.badRequest(err.message));
            } else {
                return reply(payloadClear);
            }
        });
    };

    const fooHandler = function FooHandler(request, reply) {

        const my_number = request.params.my_number;
        let response = {};

        if (my_number === 1234) {
            response = { hi: 'world ' + my_number };
        }
        else {
            response = Boom.badRequest('not 1234', my_number);
        }

        return reply(response);
    };

    server.route({
        method: 'GET',
        path: '/foo/{my_number}',
        config: {
            auth: false,
            validate: {
                params: {
                    my_number: Joi.number().integer().min(1000).max(10000)
                },
                query: false,
                payload: false
            },
            handler: fooHandler,
            description: 'Simple my_number API',
            tags: ['api']
        }
    });

    server.route({
        method: 'GET',
        path: '/token_free',
        config: { auth: false },
        handler: function (request, reply) {

            return reply(server.plugins.mdb.getHello(request.query.name));
        }
    });

    server.route({
        method: 'GET',
        path: '/restricted',
        config: { auth: 'jwt' },
        handler: function (request, reply) {

            reply({ message: 'You used a Valid JWT Token to access /restricted endpoint!' })
                .header('Authorization', request.headers.authorization);
        }
    });

    server.route({
        method: 'POST',
        path: '/loginaes',
        config: {
            auth: false,
            pre: [{ method: pre1, assign: 'm1' }], // general example: http://stackoverflow.com/a/38909177/508639
            validate: {
                params: false,
                query: false
            }
        },
        handler: function (request, reply) {

            return reply({ greeting: '(POST reply) ' + request.pre.m1.username + '-' + request.pre.m1.password });
        }
    });

    server.route({
        method: 'POST',
        path: '/login',
        config: {
            auth: false,
            validate: {
                params: false,
                query: false,
                payload: {
                    username: Joi.string().email(),
                    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
                }
            }
        },
        handler: function (request, reply) {

            const user = server.plugins.mdb.userFind(request.payload);

            if (user.length === 0) {
                return reply(Boom.unauthorized('invalid username or password'));
            }

            return reply({ greeting: '(POST reply) Hello ' + user[0].name })
                .header('Authorization', `Bearer ${user[0].jwt}`);
        }
    });

    next();
};

exports.register.attributes = {
    name: 'users'
};
