'use strict';

/* Script Modules */
/**
 * executes when merchant clicks on komoju payment settings menuaction and renders the toggle page
 */
function start() {
    var renderHelper = require('../scripts/helpers/renderHelper');
    var CustomerMgr = require('dw/customer/CustomerMgr');
    var customersQuery = CustomerMgr.searchProfiles("email !={0}", "customerNo asc",null);
    var cList=customersQuery.asList(0,customersQuery.count);
    renderHelper.render('displayCustomers', {
        customerObj:cList
    });
}

start.public = true;
exports.start = start;
