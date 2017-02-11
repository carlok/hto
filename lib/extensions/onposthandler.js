'use strict';

const Boom = require('boom');

exports.register = function (server, options, next) {

    server.ext('onPostHandler', function (request, reply) {

        // see https://github.com/hapijs/discuss/issues/103
        let source = request.response.source;

        if (parseInt(request.server.app.encrypt_output) === 1) {
            if (request.headers['content-type'] == 'text/plain') {
                request.response.source = {};
                request.response.source = server.plugins.mcrypt.encrypt(JSON.stringify(source));
            } else {
                return reply(Boom.badRequest('Wrong Content Type'));
            }

            request.response.type('text/plain');
        }

        return reply.continue();
    });

    next();
};

exports.register.attributes = {
    name: 'onposthandler'
};
