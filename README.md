# Introduction
HTO stands for [Hapi](hapijs.com) Tutorial. It is a **work in progress** I started studying "[Getting started with HapiJS](https://www.packtpub.com/web-development/getting-started-hapijs)" and a few websites/plugins. It is related to my [TorinoJS](https://github.com/carlok/torinojs-20161026) presentantion.

Create your JWT key with

```
node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
```

then

```
npm install
npm run start
```

See package.json for more details.
