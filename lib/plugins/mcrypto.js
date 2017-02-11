'use strict';

const Boom = require('boom');
const Crypto = require('crypto');

exports.register = function (server, options, next) {
    // see http://lollyrock.com/articles/nodejs-encryption/

    const algorithm = 'aes-256-ctr';

    // TODO create a plugin that retrieves it from the DB (on startup) as a singleton
    // TODO call it from here
    const password = 'a73q4bn8836QQ62N';

    const encrypt = function (text) {
        const cipher = Crypto.createCipher(algorithm, password);
        let crypted = cipher.update(text, 'utf8', 'hex');

        crypted += cipher.final('hex');

        return crypted;
    };

    const decrypt = function (text) {
        const decipher = Crypto.createDecipher(algorithm, password);

        try {
            let dec = decipher.update(text, 'hex', 'utf8');
            dec += decipher.final('utf8');

            return dec;
        } catch (mError) {

            return false;
        }
    };

    const payloadDecrypt = function (request, reply) {

        if (parseInt(request.server.app.decrypt_input) === 0) {

            return reply(request.payload);
        } else {
            let a = {};

            try {
                a = JSON.parse(decrypt(request.payload));
            } catch (mError) {
                // (maybe) due to cryto internals, it doesn't' reach this but it doesn't break hapi anyway
                reply(Boom.badRequest('Wrongly encrypted string in input'));
            }

            return reply(a);
        }

    };

    server.expose({
        decrypt: decrypt,
        encrypt: encrypt,
        payloadDecrypt: payloadDecrypt
    });

    next();
};

exports.register.attributes = {
    name: 'mcrypt'
};
