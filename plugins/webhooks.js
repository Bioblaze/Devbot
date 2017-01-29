var Events = require('../modules/Events').eventBus;
var DiscordProxy = require('../modules/DiscordProxy');
var Crypto = require('crypto');

var Status = false;
Events.on("status", function(status) {
  this.Status = status;
  if (status) {
    console.log("Example Git Webhook Script working and Running!");
  } else {
    console.log("Example Git Script not Accepting Commands untill Discord is online!");
  }
});

Events.on("webhook", function(service, name, headers, body) {
  switch (service) {
    case "github":
      var token = headers['x-hub-signature'].replace(/^sha1=/, '');//This one is more Tricky.
      var signature = Crypto.createHmac('sha1', true).update(JSON.stringify(body)).digest('hex');
      if (token !== signature) {
        console.log("Wrong Key!")
      }
    break;
    case "gitlab":
      var token = headers['x-gitlab-token']; // just a standard plaintext password/hash to cross check against.
    break;
    case "bitbucket":
      var token = body.repository.uuid; // Associates to the Repo its from. To Validate if your actually suppose to get it.

    break;
    default:

  }
});
