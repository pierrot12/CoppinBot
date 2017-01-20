var GooglePlaces = require('googleplaces');

var Location = module.exports = function () {
  this.key = process.env.API_GooglePlace;
  this.googlePlaces = new GooglePlaces(this.key, 'json');

  this.parameters = {
    language: 'fr',
    opennow: true,
    location: [48.853195, 2.387271],
    radius: 1000
  };
}

Location.prototype._getFoodParam = function () {
  return 'restaurant|food|grocery_or_supermarket';
}

Location.prototype._getDrinkParam = function () {
  return 'night_club|liquor_store|bar|cafe';
}

Location.prototype.getResto = function () {
  this.parameters.types = this._getFoodParam();

  return new Promise(function (resolve, reject) {
    this.googlePlaces.placeSearch(this.parameters, function (error, response) {
      if (error) reject(error);
      else {
        function rand(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        }
        var place = response.results[rand(0, response.results.length)];
        resolve('*' + place.name + '* - ' + place.rating + '/5 (' + place.vicinity + ')\n'
        + 'https://www.google.fr/maps/place/' + encodeURI(place.name) + '/@' + place.geometry.location.lat + ',' + place.geometry.location.lng + ',17z/');
      }
    });
  }.bind(this))
}

Location.prototype.getBar = function () {
  this.parameters.types = this._getDrinkParam();

  return new Promise(function (resolve, reject) {
    this.googlePlaces.placeSearch(this.parameters, function (error, response) {
      if (error) reject(error);
      else {
        function rand(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        }
        var place = response.results[rand(0, response.results.length)];
        resolve('*' + place.name + '* (' + place.vicinity + ')');
      }
    });
  })
}
