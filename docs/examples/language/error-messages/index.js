'use strict';

const { Language } = require('./lib');

const errorMessages = require('./messages');

const language = new Language(errorMessages);

module.exports = language;
