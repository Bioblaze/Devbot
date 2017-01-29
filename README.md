# Devbot - A Discord bot for Indie Developers

> Become a Patreon! [Donate](https://www.patreon.com/BioblazePayne)


                ▓█████▄ ▓█████ ██▒   █▓ ▄▄▄▄    ▒█████  ▄▄▄█████▓
                ▒██▀ ██▌▓█   ▀▓██░   █▒▓█████▄ ▒██▒  ██▒▓  ██▒ ▓▒
                ░██   █▌▒███   ▓██  █▒░▒██▒ ▄██▒██░  ██▒▒ ▓██░ ▒░
                ░▓█▄   ▌▒▓█  ▄  ▒██ █░░▒██░█▀  ▒██   ██░░ ▓██▓ ░
                ░▒████▓ ░▒████▒  ▒▀█░  ░▓█  ▀█▓░ ████▓▒░  ▒██▒ ░
                 ▒▒▓  ▒ ░░ ▒░ ░  ░ ▐░  ░▒▓███▀▒░ ▒░▒░▒░   ▒ ░░
                 ░ ▒  ▒  ░ ░  ░  ░ ░░  ▒░▒   ░   ░ ▒ ▒░     ░
                 ░ ░  ░    ░       ░░   ░    ░ ░ ░ ░ ▒    ░
                   ░       ░  ░     ░   ░          ░ ░
                 ░                 ░         ░

[![Discord chat](https://img.shields.io/badge/discord-join%20chat%20%E2%86%92-brightgreen.svg?style=flat)](https://discord.gg/T8uVhzU)

---

Devbot offers a simple, generic but detailed bot. Giving you examples to handle webhooks, and other web-based experiences into the bot.
More information to be posted soon.

## Download via npm

```sh
$ npm install devbot

$ cd ./node_modules/devbot

$ mv ./* ../../
```

## Download via git

```sh
$ git clone https://github.com/Bioblaze/Devbot
```

Devbot depends on [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/).


For Openshift Hosting
```
WEB: {
  IP: process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1",
  PORT: process.env.OPENSHIFT_NODEJS_PORT || 21337,
  MONGODB: process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME || 'mongodb://' + process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" + process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/' + process.env.OPENSHIFT_APP_NAME
}
```
