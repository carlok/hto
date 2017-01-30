'use strict';

const crypto = require('crypto');

exports.register = function (server, options, next) {
    // see http://lollyrock.com/articles/nodejs-encryption/

    const algorithm = 'aes-256-ctr';

    // TODO create a plugin that retrieves it from the DB (on startup) as a singleton
    // TODO and call it from here
    const password = 'a73q4bn8836QQ62N';

    const encrypt = function (text) {
        const cipher = crypto.createCipher(algorithm, password);
        let crypted = cipher.update(text, 'utf8', 'hex');

        crypted += cipher.final('hex');

        return crypted;
    };

    const decrypt = function (text) {
        const decipher = crypto.createDecipher(algorithm, password);
        let dec = decipher.update(text, 'hex', 'utf8');

        dec += decipher.final('utf8');

        return dec;
    };

    const payloadDecrypt = function(request, reply) {

        if (request.server.app.decrypt_input == 1) {
            reply(JSON.parse(decrypt(request.payload.p)));
        } else {
            reply(request.payload);
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
