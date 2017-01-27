#!/usr/bin/env node
'use strict';

/*All Includes needed for the Bot Core*/
var isfile = require('file-exists');
var jsonfile = require('jsonfile');
var configfile = './config.json';

var Event = require('./modules/Events').eventBus; // One way Events from the Main Core System
var DiscordProxy = require('./modules/DiscordProxy'); // Proxy between Core & Plugins
var Discord = require('discord.io'); // Required for the Bot to do anything with Discord
var Plugins = require('require-all')(__dirname + '/plugins');//Loads all Plugins into the Bot
var express = require('express');
var app = express();

/*System Related Variables & Checks*/
var SYSTEM = {
  CURRENT_VERSION: require('./package.json').version,
  LATEST_VERSION: null,
  UPDATE_AVAILABLE: false,
  NPM_URL: "https://registry.npmjs.org/devbot",
  HOMEPAGE_URL: null,
  BUGREPORT_URL: null,
  AUTHOR: null,
  CONFIG: null
};

require("request").get(SYSTEM.NPM_URL, function (err, res, body) {
    if (err) {
      console.log("[ERROR] There was a Error Checking the NPM Registry for Version Information!\nBot Shutting Down.....");
      process.exit();
    }
    console.log("[UPDATE CHECK] Checking for Update....");
    var data = JSON.parse((body));
    var NPM_VERSION = data['dist-tags'].latest;
    SYSTEM.AUTHOR = data.author;
    SYSTEM.BUGREPORT_URL = data.bugs.url;
    SYSTEM.HOMEPAGE_URL = data.homepage;
    if (require("semver").lt(SYSTEM.CURRENT_VERSION, NPM_VERSION)) {
        console.log("[UPDATE THE BOT]: This BOT is out of date! Your version is (" + SYSTEM.CURRENT_VERSION + ") but the latest version on NPM is (" + NPM_VERSION + ")\nWhen are you going to Update HUH!");
    } else {
      console.log("[UPDATE CHECKED] No Updates Found!");
    }
    if (!isfile(configfile)) {
      console.log("[SETUP START] Seems like this is the first time the bot has been Launched. \n[CONFIG CREATION] Creating config.json and filling it up. Please wait a momment......");
      var data = {
        TOKEN: null,
        TRIGGER: "!"
      };
      jsonfile.writeFile(configfile,data, function(err) {
        if (err) {
          console.log("[ERROR] Error in creating the Config file.\n[ERROR] Please check the permissions. Application Terminating.....");
          process.exit();
        } else {
          console.log("[SETUP COMPLETE] Seems to be all Set. Please edit the " + configfile + " adding the Discord Bot Token information.\nProcess will Close now!");
          process.exit();
        }
      });
    } else {
      console.log("[INFORMATION] Config file found! Loading.......");
      jsonfile.readFile(configfile, function(err, data) {
        if (err) {
          console.log("Error in Parsing and Loading the Config file.\nPlease check the permissions.\nApplication Terminating.....");
          process.exit();
        } else {
          SYSTEM.CONFIG = data;
          if (SYSTEM.CONFIG.TOKEN == null) {
            console.log("[SETUP REQUIRED] Please edit the " + configfile + " adding the Discord Bot Token information.\nProcess will Close now!");
            process.exit();
          } else {
            app.use(bodyparser.urlencoded({ extended: true }));
            app.use(bodyparser.json());
            var Client = new Discord.Client({
              token: SYSTEM.CONFIG.TOKEN
            });
            DiscordProxy.addClient(Client);
            Client.on('ready', function(event) {
              console.log("[DISCORD] Connected!");
              Event.emit("status", true);
            });
            Client.on('disconnect', function(errMsg, code) {
              console.log("[DISCORD] Disconnected!");
              Event.emit("status", false);
              Client.connect();
            });
            Client.on('message', function(user, userID, channelID, message, event) {
              if (Client.id == userID) return;
              Event.emit("message", user, userID, channelID, message, event);
              var arr = message.split(" ");
              if (arr[0].charAt(0) == SYSTEM.CONFIG.TRIGGER) {
                Event.emit("command", arr[0].slice(1), user, userID, channelID, message);
              }
            });
            Client.on('presence', function(user, userID, status, game, event) {
              Event.emit("presence", user, userID, status, game, event);
            });
            app.post("/api/webhook/github", function(req, res) {
              console.log("[WEBHOOK RECEIVED] Received a webhook from Github!");
              var token = req.headers['x-hub-signature'];
              if (!token) {
                console.log("[INVALID WEBHOOK] Received a Invalid Github Webhook.. Does someone have the Link?");
                res.status(504).json({ success: false });
              } else {
                Event.emit("webhook", "github", token.replace(/^sha1=/, ''), req.body);
                res.status(200).json({ success: true });
              }
            });
            app.post("/api/webhook/gitlab", function(req, res) {
              console.log("[WEBHOOK RECEIVED] Received a webhook from Gitlab!");
              var token = req.headers['x-gitlab-token'];
              if (!token) {
                console.log("[INVALID WEBHOOK] Received a Invalid Gitlab Webhook.. Does someone have the Link?");
                res.status(504).json({ success: false });
              } else {
                Event.emit("webhook", "github", token, req.body);
                res.status(200).json({ success: true });
              }
            });
            app.listen(Config.ServerPort, Config.ServerIP, function() {
              Client.connect();
              console.log("[BOT] System Online!");
            });
          }
        }
      });

    }
});
