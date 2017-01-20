var skills = require('./data/skills.js');

var WhoIs = module.exports = function () {
    this.people = [];
};

var Skill = function (name, alias, skill) {
    this.name = name;
    this.pseudo = alias.split('|');
    this.skill = skill;
};

WhoIs.prototype.initialize = function (){
    this.people = [];
    function fillPeople(element, index, array){
        this.people.push(new Skill(element[0], element[1], element[2]))
    }
    skills.forEach(fillPeople,this);
}

WhoIs.prototype.findSkill = function (nameOrAlias) {
    
    if (nameOrAlias.indexOf("@") == -1)
        nameOrAlias = nameOrAlias.toLowerCase();

    var person = new Skill(capitalizeFirstLetter(nameOrAlias), nameOrAlias.toLowerCase(), "un c:\wassim")

    function findPerson(arrPerson, index, array){
        if (arrPerson.pseudo.indexOf(nameOrAlias) > -1)
            person = arrPerson;
    }

    this.people.forEach(findPerson);

    return person;
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

WhoIs.prototype.isWhoIs = function (sentence) {
    var results = new RegExp('tu connais(.*)\\?', 'i').exec(sentence);
    if (results)
        return results[1].trim();
    
    return null;
}


WhoIs.prototype.getSkill = function (nameOrAlias) {
    var person = this.findSkill(nameOrAlias);
    return person.name + " ? ...\n" 
        + "C'est " + person.skill + " tadadadam tadam tadam :notes:";
};