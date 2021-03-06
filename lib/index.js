var express = require('express');
var bodyparser = require("body-parser");
var sesion = require('express-session');
var helmet = require('helmet');
var fingerprint = require('express-fingerprint');

var discord = require('discord.js-router');

var moment = require('moment');

var path = require('path');
var fs = require('fs');
var util = require('util');


var log4js = require('log4js');
log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    console:  {
      type: 'file', filename: path.join(require.main.paths[0], "..", "logs")
    }
  },
  categories: {
    default: {
      appenders: ['out', 'console'],
      level: 'all'
    }
  }
});


var Validator = require('jsonschema').Validator;
var v = new Validator();

var botSchema = {
  id: "/botSchema",
  type: "object",
  properties: {
    plugins_dir: {
      type: "string"
    },
    token: {
      type: "string"
    },
    trigger: {
      type: "string"
    },
    reactions: {
      type: "boolean"
    },
    guilds: {
      type: "boolean"
    },
    members: {
      type: "boolean"
    },
    owners: {
      type: "array",
      minItems: 1,
      uniqueItems: true,
      items: {
        type: "string",
        pattern: /[0-9]{17,19}/,
      }
    }
  },
  required: ["plugins_dir", "owners", "trigger"]
};
var settingsSchema = {
  id: "/settingsSchema",
  type: "object",
  properties: {
    host: {
      type: "string"
    },
    port: {
      type: "integer",
      minimum: 1024,
      maximum: 65535
    },
    routes: {
      type: "string"
    },
    notfound_redirect: {
      type: "string"
    },
    bot: {
      type: "object"
    },
    helmet: {
      type: "object"
    },
    session: {
      type: "object"
    }
  },
  required: ["routes", "bot", "host", "port"]
};

var instance;

class DevBot {
  constructor() {
    this.bot = discord;
    this.app = express();
  }
  get on() {
    return instance.bot.on;
  }
  get Router() {
    return instance.app.Router;
  }
  get use() {
    return instance.app.use;
  }
  get log() {
    return log4js.getLogger('DevBot');
  }
  get time() {
    return moment;
  }
  startService(settings) {
    let chk = v.validate(settings, settingsSchema);
    if (chk.errors.length > 0) {
      return console.log(new Error(util.inspect(chk.errors, false, null, true)));
    } else {
      instance.bot.start(settings.bot);
      instance.app.use(session(settings.session || null));
      instance.app.use(helmet(settings.helmet || null));
      instance.app.use(bodyParser.urlencoded({ extended: true }));
      instance.app.use(fingerprint({
        parameters: [
          fingerprint.useragent,
          fingerprint.acceptHeaders,
          fingerprint.geoip
        ]
      }));
      instance.app.use(bodyParser.json());
      instance.app.error(function(err, req, res, next) {
        if (err instanceof NotFound) {
          instance.log.error(`${moment()} Express(Page Not Found): ${util.inspect(err, false, null, true)}`);
          if (!settings.notfound_redirect) {
            res.send("404 Page not Found.");
          } else {
            res.redirect(settings.error_redirect);
          }
        } else {
          instance.log.error(`${moment()} Express: ${util.inspect(err, false, null, true)}`);
          next(err);
        }
      });
      instance.app.use(require(path.join(require.main.paths[0], "..", settings.routes)));
      instance.app.listen(settings.port, settings.host, function() {
        instance.log.info(`${moment()} Express Started`);
      });
    }
  }
}

module.exports = function() {
  return instance || (instance = new DevBot());
}();
