'use strict';

const Boom = require('boom');

exports.register = function (server, options, next) {

    server.ext('onPreHandler', function (request, reply) {

        switch (request.headers['content-type']) {
            case 'application/json':
                if (parseInt(request.server.app.decrypt_input) === 0) {

                    return reply.continue();
                } else {

                    return reply(Boom.badRequest('Wrong Content-Type (application/json)'));
                }

                break;
            case 'text/plain':
                if (parseInt(request.server.app.decrypt_input) === 1) {

                    reply.continue();

                } else {

                    return reply(Boom.badRequest('Wrong Content-Type (text/plain)'));
                }

                break;
            default:
                return reply(Boom.badRequest('Wrong Content-Type (' + request.headers['content-type'] + ')'));
        }
    });

    next();
};

exports.register.attributes = {
    name: 'onprehandler'
};
