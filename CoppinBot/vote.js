var Vote = module.exports = function () {
    this.poll = [];
    this.responses = [];
    this.subject = 'empty';
    this.isStarted = false;
}

Vote.prototype.ADD = " add ";
Vote.prototype.VOTE = " vote ";
Vote.prototype.SUBJECT = " subject ";
Vote.prototype.START = " startpoll";
Vote.prototype.STOP = " stoppoll";
Vote.prototype.LIST = " list";
Vote.prototype.HELP = " helppoll";

Vote.prototype._reset = function () {
    this.poll = [];
    this.responses = [];
    this.subject = 'empty';
    this.isStarted = false;
}

Vote.prototype.add = function (textToAdd) {
    
    if (this.isStarted) { return { text : 'Poll already start. You can\'t add more choices', 'private' : true }; }
    var response = { text : '', 'private' : false };
    
    for (var i = 0; i < this.poll.length; i++) {
        if (this.poll[i] == textToAdd) {
            response.text = textToAdd + ' has already been added.';
            return response;
        }
    }
    
    this.poll.push(textToAdd);
        
    response.text = textToAdd + ' added!';
    response.private = false;
    
    return response;
}

Vote.prototype.setSubject = function (textToAdd) {
    var response = { text : '', 'private' : false };
    
    this.subject = textToAdd;
    response.text = 'Subject set : *' + textToAdd + "*";
    response.private = false;
    
    return response;
}

Vote.prototype.list = function () {
    var response = { text : '', 'private' : false };
    
    response.text = 'Subject : *' + this.subject + "*\n Choices : \n " + this.poll.join('\n');
    response.private = true;
    
    return response;
}

Vote.prototype.startPoll = function () {
    var response = { text : '', 'private' : false };
    
    if (this.subject == 'empty' || this.subject == '') return { text : 'Dis la question BATARD', 'private' : false };
    
    this.isStarted = true;

    var toReturn = 'Poll started, let\'s vote !\n\nSubject : *' + this.subject + '*\n\nFor informations, choices are : \n';
    
    toReturn += this.poll.join('\n') + '\n\nEnter :```coppin vote [YourChoice]```'
    
    response.text = toReturn;
    response.private = false;
    
    return response;

}

Vote.prototype.stopPoll = function () {
    var response = { text : '', 'private' : false };
    
    this.isStarted = false;
    
    var toReturn = 'Poll stopped. Results below\n';
    var _this = this;
    
    var resultats = Object.keys(this.responses).reduce(function (result, key, index) {
        result[_this.responses[key]] = (result[_this.responses[key]] || 0) + 1;
        return result;
    }, {});

    var i = 0;
    for (var k in resultats) {
        if (i === 0)
            toReturn += this.subject + " : *" + k + "* - (" + resultats[k] + ")\n";
        else
            toReturn += k + " - " + resultats[k] + "\n";
        i++;
    }
    
    response.text = toReturn;
    response.private = false;
    
    this._reset();
    
    return response;
}

Vote.prototype.vote = function (textToSearch, idUser) {
    var response = { text : '', 'private' : false };
    
    function matchInArray(string, expressions) {
        
        var len = expressions.length,
            i = 0;
        
        for (; i < len; i++) {
            if (string.toLowerCase().match(expressions[i].toLowerCase())) {
                return i;
            }
        }
        
        return -1;

    };
    
    if (!this.isStarted) return { text : 'Dude... poll has not been started yet.', 'private' : false };
    
    var index = matchInArray(textToSearch, this.poll);
    
    
    if (index == -1) return { text : 'Your choice has not been found.', 'private' : false };
    
    response.text = 'Thanks maaan !';
    
    if (this.responses[idUser])
        response.text = 'Thanks maaan ! Your new vote is set';
    
    this.responses[idUser] = this.poll[index];
    
    return response;
}

Vote.prototype.help = function () {
    var response = { text : '', 'private' : false };
    
    response.text = "Tout d'abord vous devez commencer une commande par `@coppin` ou `coppin` ou `copin` ou `copcop`\n" 
    + "Ensuite vous pouvez commencer le sondage en ajoutant des réponses `@coppin add [choix1]` ou en donnant la question `@coppin subject [Quel est la réponse ?]`\n" 
    + "Une fois le vote configuré, vous pouvez démarrer le sondage avec `@coppin startpoll`\n" 
    + "Le vote s'effectue en faisant `@coppin vote [choix]`\n" 
    + "Pour terminer le vote et afficher les résultats, il suffit d'écrire `@coppin stoppoll`\n" 
    + "Jusqu'à la fin, il est possible d'afficher la liste des choix possibles en faisant `@coppin list`";
    response.private = true;
    
    return response;
}

Vote.prototype.get = function (allText, user) {
    
    var containAdd = allText.toLowerCase().indexOf(this.ADD) > -1;
    var containVote = allText.toLowerCase().indexOf(this.VOTE) > -1;
    var containSubject = allText.toLowerCase().indexOf(this.SUBJECT) > -1;
    var containStart = allText.toLowerCase().indexOf(this.START) > -1;
    var containStop = allText.toLowerCase().indexOf(this.STOP) > -1;
    var containList = allText.toLowerCase().indexOf(this.LIST) > -1;
    var containHelp = allText.toLowerCase().indexOf(this.HELP) > -1;

    if (containAdd) {
        var splitedTextAdd = allText.toLowerCase().split(this.ADD);
        var text = allText.substr(splitedTextAdd[0].length + this.ADD.length);
        
        return this.add(text.trim());
    }

    if (containVote) {
        var splitedTextVote = allText.toLowerCase().split(this.VOTE);
        var text = allText.substr(splitedTextVote[0].length + this.VOTE.length);
        
        return this.vote(text.trim(), user);
    }
    if (containSubject) {
        var splitedTextSubject = allText.toLowerCase().split(this.SUBJECT);
        var text = allText.substr(splitedTextSubject[0].length + this.SUBJECT.length);
        
        return this.setSubject(text.trim());
    }

    if (containStart) return this.startPoll();
    if (containStop) this.stopPoll();
    if (containList) return this.list();
    if (containHelp) return this.help();

    return;
}