var DiscordProxy = {
  addClient: function(client) {
    this.client = client;
    this.plugins = [];
  },
  sendMessage: function(id, message) {
    if (!this.client) {
      console.log("No Client Found");
    } else {
      this.client.sendMessage({
        to: id,
        message: message
      });
    }
  },
  sendEmbed: function(id, msg, embed) {
    if (!this.client) {
      console.log("No Client Found");
    } else {
      this.client.sendMessage({
        to: id,
        message: msg,
        embed: embed
      });
    }
  },
  setTopic: function(channelID, Topic) {
    this.client.editChannelInfo({
      channelID: channelID,
      topic: Topic
    });
  },
  setIdle: function(idle) {
    var data = {};
    if (!idle) {
      data.idle_since = null;
    } else {
      data.idle_since = Date.now();
    }
    this.client.setPresence(data);
  },
  setBotNick: function(name, serverID) {
      this.client.editNickname({
        nick: name,
        userID: this.client.id,
        serverID: serverID
      });
  },
  getID: function() {
    return this.client.id;
  },
  getServerFromChannel: function(channelID) {
    return this.client.channels[channelID].guild_id;
  },
  getChannelsFromServer: function(serverID) {
    return this.client.servers[serverID].channels;
  }
}

module.exports = DiscordProxy;
