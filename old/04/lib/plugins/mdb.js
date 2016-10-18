'use strict';

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

    const getHello = function (name) {

        const target = name || 'world';
        return `Hello ${target}`;
    };

    const userFind = function (user) {

        // getHello(usern.username)

        const picked = Lodash.filter(users, (x) =>

            (x.username === user.username) && (x.password === Sha256(user.password))
        );

        return picked;
    };

    server.expose({
        getHello: getHello,
        userFind: userFind
    });

    next();
};

exports.register.attributes = {
    name: 'mdb'
};
