var Transaction = require('dw/system/Transaction');
var CustomerMgr = require('dw/customer/CustomerMgr');

/**
 *  function to update the customer
 *
 * */
function updateCustomer() {
    var customerNo = request.httpParameterMap.customerNo;
    var optIn = request.httpParameterMap.optIn.booleanValue;
    var customer = CustomerMgr.getCustomerByCustomerNumber(customerNo);
    if(optIn){
        Transaction.wrap(function () {
            customer.getProfile().custom.OptIn = false;
        });
    }
    else{
        Transaction.wrap(function () {
            customer.getProfile().custom.OptIn = true;
        });
    }
    // res.render('displayCustomers');
}

updateCustomer.public = true;
exports.updateCustomer = updateCustomer;