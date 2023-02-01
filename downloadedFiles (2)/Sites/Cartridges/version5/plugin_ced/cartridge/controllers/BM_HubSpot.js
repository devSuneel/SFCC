'use strict';

var ISML = require('dw/template/ISML');

function start() {
  ISML.renderTemplate('hubspot/setup', {
    Message: 'Hello, CED!'
  });
  return;
}

function acceptTerms() {
  ISML.renderTemplate('hubspot/setup');
  return;
}

function callback() {
  ISML.renderTemplate('hubspot/setup');
  return;
}

function disconnect() {
  ISML.renderTemplate('hubspot/setup');
  return;
}

function manage() {
  ISML.renderTemplate('hubspot/setup');
  return;
}

module.exports.Start = start;
module.exports.Start.public = true;
module.exports.AcceptTerms = acceptTerms;
module.exports.AcceptTerms.public = true;
module.exports.Callback = callback;
module.exports.Callback.public = true;
module.exports.Disconnect = disconnect;
module.exports.Disconnect.public = true;
module.exports.Manage = manage;
module.exports.Manage.public = true;
