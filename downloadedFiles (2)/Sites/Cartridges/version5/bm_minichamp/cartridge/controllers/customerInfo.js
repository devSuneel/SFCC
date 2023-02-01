'use strict';

/* Script Modules */
/**
 * executes when merchant clicks on komoju payment settings menuaction and renders the toggle page
 */
function start() {
    var renderHelper = require('../scripts/helpers/renderHelper');
    var CustomerMgr = require('dw/customer/CustomerMgr');
    var customersQuery = CustomerMgr.searchProfiles("email !={0}", "customerNo asc",null);
    var cList=customersQuery.asList(0,1);
    renderHelper.render('displayCustomers', {
    });
}

start.public = true;
exports.start = start;
