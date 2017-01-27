'use strict';

exports.register = function (server, options, next) {

    server.ext('onPreResponse', function (request, reply) {

        // see https://github.com/hapijs/discuss/issues/103
        let source = request.response.source;

        if (request.server.app.encrypt_output == 1) {
            request.response.source = {};
            request.response.source.p = server.plugins.mcrypt.encrypt(JSON.stringify(source));
        }

        return reply.continue();
    });

    next();
};

exports.register.attributes = {
    name: 'onpreresponse'
};