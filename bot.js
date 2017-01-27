var Event = require('./modules/Events').eventBus; // One way Events from the Main Core System.
var Discord = require('discord.io'); // Required for the Bot to do anything with Discord

var config = {
  token: "<Discord Bot Token Here>",
  cmdTrigger: "!"
};


var Client = new Discord.Client({
  token: config.token,
  autorun: true
});

var DiscordProxy = require('./modules/DiscordProxy');
DiscordProxy.addClient(Client);

var Plugins = require('require-all')(__dirname + '/plugins');
Client.on('ready', function(event) {
  Event.emit("status", true);
});
Client.on('disconnect', function(errMsg, code) {
  Event.emit("status", false);
  Client.connect();
});
Client.on('message', function(user, userID, channelID, message, event) {
  if (Client.id == userID) return;
  console.log(message);
  Event.emit("message", user, userID, channelID, message, event);
  var arr = message.split(" ");
  if (arr[0].charAt(0) == config.cmdTrigger) {
    Event.emit("command", arr[0].slice(1), user, userID, channelID, message);
  }
});
Client.on('presence', function(user, userID, status, game, event) {
  Event.emit("presence", user, userID, status, game, event);
});
