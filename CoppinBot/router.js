var keywords = require('./data/route-messages');
var responses = require('./data/slackbot-response');
var specials = require('./data/special_route');
var people = require('./data/names');
var repliques = require('./data/repliques');

var Location = require('./location');
var loc = new Location();

var Router = module.exports = function () {
  this.message = '';
  this.id = '';
  this.sender = '';
};

Router.prototype.route = function (message, sender, id) {
  this.sender = sender;
  this.id = id;
  this.message = message;
    
  function Replique(message){
        if (askReplique(message))
            return true;
  }

  function Who(message) {
    if (quiFind(message) && message.trim().slice(-1) == '?')
      return true;
  }

  function Manger(message) {
    if ((message.toLowerCase().indexOf("ou") >= 0 ||
      message.toLowerCase().indexOf("où") >= 0) &&
      message.toLowerCase().indexOf("mange") >= 0 &&
      message.trim().slice(-1) == '?')
      return true;
    return false;
  }

  function Boire(message) {
    if ((message.toLowerCase().indexOf("ou") >= 0 ||
      message.toLowerCase().indexOf("où") >= 0) &&
      message.toLowerCase().indexOf("boire") >= 0 &&
      message.trim().slice(-1) == '?')
      return true;
    return false;
  }

  function quiFind(str) {
    if (str.toLowerCase().indexOf("qui ") == 0 || str.toLowerCase().indexOf(" qui ") > 0)
      return true
    return false;
  }
    
  function askReplique(str) {
        if (str.toLowerCase().indexOf("replique") >  0 || str.toLowerCase().indexOf(" replique ") > 0 || str.toLowerCase().indexOf("réplique") > 0)
            return true
        return false;
  }

  function isQuestion(message) {
    if (isCoppinMentioned(message) && message.trim().slice(-1) == '?')
      return true;
  }

  function returnOuiNon() {
    if (Math.floor(Math.random() * (2 - 1 + 1) + 1) == 1) return "Oui";
    return "Non";
  }

  function containsQuoi(str) {
    if (str.indexOf('quoi') > -1)
      return true;
    return false;
  }

  function isMatch(keyword) {
    if (message.toUpperCase().indexOf(keyword.toUpperCase()) > -1)
      return (message.toUpperCase().indexOf(keyword.toUpperCase() + ' ') == 0)
        || (message.toUpperCase() == keyword.toUpperCase())
        || (message.toUpperCase().indexOf(' ' + keyword.toUpperCase() + ' ') > 0)
        || (message.toUpperCase().indexOf(' ' + keyword.toUpperCase()) == message.length - (' ' + keyword.toUpperCase()).length);
    return false;
  }

    if (Who(message))
        return Promise.resolve(people[Math.floor(Math.random() * people.length)]);
    
    if (Replique(message))
        return Promise.resolve(repliques[Math.floor(Math.random() * repliques.length)]);

    if (Manger(message))
        return loc.getResto();

    if (Boire(message))
        return loc.getBar();

    if (isQuestion(message))
        if (containsQuoi(message.toLowerCase())) {
            if (Math.floor(Math.random() * (2 - 1 + 1) + 1) == 1) return Promise.resolve("Rien");
                return Promise.resolve("Demande à ta mère");
        }
    else
      return Promise.resolve(returnOuiNon());

  if (keywords.some(isMatch))
    return Promise.resolve(this.randomSentence());

  function findSpecial(obj) {
    return Promise.resolve(isMatch(obj.keyword));
  }

  var result = specials.filter(findSpecial);
  if (result.length > 0)
    return Promise.resolve(result[0].response);
};

Router.prototype.randomSentence = function () {
  return responses[Math.floor(Math.random() * responses.length)];
};

function isCoppinMentioned(text) {
  if (text.toLowerCase().indexOf("coppin") >= 0
    || text.toLowerCase().indexOf("copin") >= 0
    || text.toLowerCase().indexOf("copcop") >= 0
    || text.indexOf("<@U0811APCL>") >= 0)
    return true;
  return false;
}