if (!process.env.API_Slack || !process.env.API_GooglePlace) throw new Error("API key(s) missing");

var Slack = require('slack-client');
var WhoIs = require('./whoIs.js');
var Router = require('./router.js');
var Vote = require('./vote.js');
var giphy = require('giphy-api')();


var whoIs = new WhoIs();
var coppin = new Router();
var slack = new Slack(process.env.API_Slack, true, false);
var vote = new Vote();

whoIs.initialize();
slack.on('open', function () {
    var channels = Object.keys(slack.channels)
    
    //reponse(channels[0], 'Je vous avais manqué ? Je suis de retour @channel!');
    
});


slack.on('message', function (message) {

  if (!message.text) return;
  if (message.type !== 'message') return;

  var user = slack.getUserByID(message.user);
  if (user.is_bot) return;

  var channel = slack.getChannelGroupOrDMByID(message.channel);

  var textSlack = message.text;
    
    
    
    if (bonneAnnee(textSlack)) {
        
        
        var http = require('http');
        
        var test = '';
        var options = {
            host: 'http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=dc6zaTOxFJmzC',
            port: 80,
            method: 'POST'
        };
        
        http.request(options, function (res) {
            test += 'STATUS: ' + res.statusCode;
            test += 'HEADERS: ' + JSON.stringify(res.headers);
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                test += 'BODY: ' + chunk;
            });
        }).end();



        reponse(channel, 'On sait très bien que tu t\'en fou');
        return;
    }
    
    
    if (wakeUp(textSlack)) {
        var chanMembers = channel.members;
        var response = "Wake up";
        for (var u = 0; u < chanMembers.length ; u++) {
            var user = chanMembers[u];
            if(user != 'U37P7468N')
                response += " " + makeMention(user);            
        }
        reponse(channel, response + "!");
        return;
    } 
   

  if (!isCoppinMentioned(textSlack)) return;

  var who = whoIs.isWhoIs(textSlack);

  if (who) {
    reponse(channel, whoIs.getSkill(who));
    return;
    }
  
  var res = vote.get(textSlack, user.id);

  if (res) {
    if (res.private) reponse(slack.getDMByName(user.name), res.text);
    else reponse(channel, res.text);
    return;
    }
    
    

  var retour = coppin.route(textSlack, user, 0);
  retour.then(function (val) {
    if (val)
      reponse(channel, val);
  }, function (err) {
    response(channel, err);
  });
});

function bonneAnnee(text) {
    if (text.toLowerCase().indexOf("bonne année") >= 0 
        || text.toLowerCase().indexOf("bon année") >= 0 
        || text.toLowerCase().indexOf("happy new year") >= 0)
        return true;
    return false;
}

function wakeUp(text) {
    if (text.toLowerCase().indexOf("wake up") >= 0 
        || text.toLowerCase().indexOf("debout") >= 0 
        || text.toLowerCase().indexOf("debout!") >= 0)
        return true;
    return false;
}

function isCoppinMentioned(text) {
  if (text.toLowerCase().indexOf("coppin") >= 0
    || text.toLowerCase().indexOf("copin") >= 0
    || text.toLowerCase().indexOf("copcop") >= 0
    || text.indexOf("<@U37P7468N>") >= 0)
    return true;
  return false;
}

function reponse(channel, message) {
  channel.send(message);
};

function makeMention(userId) {
  return '<@' + userId + '>';
};

slack.login();
