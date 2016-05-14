'use strict';

var chai = require('chai');
var sinonChai = require('sinon-chai');
var paths = require('app-module-path');
var Validator = require('validator');

chai.use(sinonChai);

paths.addPath(__dirname + '../core');

global.expect = chai.expect;
global.Validator = Validator;
