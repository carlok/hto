'use strict';

const JWT = require('jsonwebtoken');
const Lodash = require('lodash');
const Sha256 = require('sha256');

exports.register = function (server, options, next) {

    const users = [
        {
            name: 'Carlo',
            username: 'carlo@aaa.it',
            password: 'a95bc16631ae2b6fadb455ee018da0adc2703e56d89e3eed074ce56d2f7b1b6a' // qqq
        }
    ];

    const getHello = function (name = 'world') {

        return { hello: name };
    };

    const userFind = function (user) {

        const picked = Lodash.filter(users, (x) =>

            (x.username === user.username) && (x.password === Sha256(user.password))
        );

        if (picked.length === 0) {
            return picked;
        }
        else {
            const jwt = JWT.sign({ name: picked[0].name, username: picked[0].username }, options.jwt_skey);

            return [{ jwt: jwt, name: picked[0].name, username: picked[0].username }];
        }
    };

    // bring your own validation function
    const userValidate = function (decoded, request, callback) {

        /*console.log('decoded token: ', decoded);
         console.log('request info: ', request.info);
         console.log('user agent: ', request.headers['user-agent']);

         console.log('hello', server.plugins.mdb.getHello());*/

        // do your checks to see if the person is valid
        const userIndex = Lodash.findIndex(users, function (o) {

            return o.username === decoded.username;
        });

        return (userIndex === -1) ? callback(null, false) : callback(null, true);
    };

    server.expose({
        getHello: getHello,
        userFind: userFind,
        userValidate: userValidate
    });

    next();
};

exports.register.attributes = {
    name: 'mdb'
};
