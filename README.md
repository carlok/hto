# Introduction
HTO stands for [Hapi](hapijs.com) Tutorial/Exercises. It is a **work in progress** I started studying "[Getting started with HapiJS](https://www.packtpub.com/web-development/getting-started-hapijs)". The idea is to create a server side version of [TodoMVC](http://todomvc.com/) with JWT user authentication.

* 01: initial
* 02: plugin
* 03: glue
* 04: test
* 05: jwt initial

# Code notes
    npm install foobar --save --save-exact
    ./node_modules/lab/bin/lab --lint --lint-fix XY/lib/index.js
    http POST http://localhost:1337/api/v1/users/login username=carlo@aaa.it password=qqq -j --verbose

# jwt

    http http://localhost:1337/api/v1/users/token_free -j --verbose

	http --auth-type=jwt --auth='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkplbiBKb25lcyIsImlhdCI6MTQ3NjYzNjcxMX0.UtpdCtNgw_ZdgnSKg4ybUV0sVPnM4M0h0HzneYX_aNs:' http://localhost:1337/api/v1/users/restricted -j --verbose # don't forget the ":"

# NOTES
	"scripts": {
		"lint": "lab --lint --lint-fix lib/index.js",
		"lint-test-crypted": "lab --lint --lint-fix test/crypted",
		"lint-test-plain": "lab --lint --lint-fix test/plain",
		"start": "nodemon lib/index.js",
		"start-dev": "NODE_ENV=develop nodemon lib/index.js",
		"test-crypted": "lab -C -c -m 20000 -v test/crypted",
		"test-plain": "lab -C -c -m 20000 -v test/plain",
		"test-single": "lab -C -m 20000 -v -l"
		},
