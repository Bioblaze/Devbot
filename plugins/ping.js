var Events = require('../modules/Events').eventBus;
var DiscordProxy = require('../modules/DiscordProxy');

var Status = false;
Events.on("status", function(status) {
  this.Status = status;
  if (status) {
    console.log("Ping Script working and Running!");
  } else {
    console.log("Ping Script not Accepting Commands untill Discord is online!");
  }
});
Events.on("command", function(cmd, user, userID, channelID, msg) {
  if (!this.Status) return;
  if (cmd.toLowerCase() == "ping") {
    DiscordProxy.sendMessage(channelID, "<@!" + userID + ">:" + " PONG!");
  } else if (cmd.toLowerCase() == "pong") {
    DiscordProxy.sendMessage(channelID, "<@!" + userID + ">:" + " PING!");
  }
});
