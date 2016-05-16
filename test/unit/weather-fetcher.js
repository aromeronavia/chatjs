'use strict';

const chai = require('chai');
const expect = chai.expect;
const nock = require('nock');

const WeatherFetcher = require('./../../core/weather-fetcher.js');
const FAKE_WEATHER = require('./fixtures/weather.json');
const API_URL = 'http://api.openweathermap.org';

describe('#WeatherFetcher', () => {
  it('should return the weather from Guadalajara', (done) => {
    nock(API_URL)
      .get('/data/2.5/weather')
      .query(true)
      .reply(200, FAKE_WEATHER);

    const fetcher = new WeatherFetcher({
      credentials: '856d38d3af82376b6623f1cb55eccc8e'
    });
    fetcher.fetchWeather((error, response) => {
      if (error) return done(error);
      expect(response.temp).to.exist;
      expect(response.temp).to.be.equal(32);
      done();
    });
  });
});
