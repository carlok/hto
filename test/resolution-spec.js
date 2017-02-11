const request = require("request");

const Server = require("../lib/index.js");

process.env.SERVER_ENV !== 'production' ? Env(__dirname + './../.env') : null;

const base_url = 'http://' + process.env.HOST + ':' + process.env.PORT + process.env.PREFIX;

describe("Hello World Server", function () {
    describe("POST /users/loginaes", function () {
        it("returns crypt", function (done) {

            request({
                method: 'POST',
                headers: {'Content-Type': 'text/plain'},
                uri: base_url + '/users/loginaes',
                body: '0b8554097decfd36a81acaac2944a68932e0e4132edd9e8de8c83b371d132902a26037556ff91236b77f31fc'
            }, function (error, response, body) {
                //expect(response.statusCode).toBe(200);
                expect(body).toBe('0b8546087dfbe73eab18caac290f97b40ddb84002accdc9db5ca74741f1e3531b46e241f24b71d36b77f31fc');

                Server.stop((err) => {

                    console.log('Server stopped');
                });

                done();
            });
        });
    });
});