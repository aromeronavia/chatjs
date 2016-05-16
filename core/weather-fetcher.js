'use strict';

const request = require('request');
const url = require('url');
const _ = require('lodash');

const deliverWeather = function(response) {
  const temperature = parseInt(_.get(response, 'main.temp', 0), 10);
  const weather = {
    temp: (temperature - 270)
  };
  return weather;
};

class WeatherFetcher {
  constructor(args) {
    this.apiKey = args.credentials;
  }

  fetchWeather(callback) {
    const uri = this._buildURI();
    let jsonResponse;

    request(uri, (error, response) => {
      if (error) return callback(new Error('Problem with OpenWeatherMap.org'));

      try {
        jsonResponse = JSON.parse(response.body);
      } catch (parseError) {
        return callback(new Error('Error trying to parse the response'));
      }

      return callback(null, deliverWeather(jsonResponse));
    });
  }

  _buildURI() {
    const query = 'q=Guadalajara&apiKey=' + this.apiKey;
    const uriObj = {
      protocol: 'http',
      hostname: 'api.openweathermap.org',
      pathname: '/data/2.5/weather',
      search: query
    };
    const uri = url.format(uriObj);
    return uri;
  }
}

module.exports = WeatherFetcher;
