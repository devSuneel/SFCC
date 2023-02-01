'use strict';
/**
 * All the nodes for TikTok BM extension
 * @module controllers/BM_TikTok
 */

var ISML = require('dw/template/ISML');

/**
 * Landing page for TikTok
 */
function start() {
  ISML.renderTemplate('hubspot/setup', {
    Message: 'Hello CED!'
  });
}



/**
 * Manage tiktok page
 */
function manage() {
  ISML.renderTemplate('hubspot/setup', {
    Message: 'Hello CED!'
  });
}


/**
 * Endpoints
 */
module.exports.Start = start;
module.exports.Start.public = true;
module.exports.Manage = manage;
module.exports.Manage.public = true;
