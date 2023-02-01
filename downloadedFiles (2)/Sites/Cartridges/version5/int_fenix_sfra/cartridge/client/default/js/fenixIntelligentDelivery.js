/* eslint-disable no-undef */
'use strict';


/**
 * Registering on change event on variant selected.
 */

var isEmpty = function (input) {
    if (input == null) { return true; }

    if (typeof input === 'object') {
        return input.length === 0;
    }

    return !input || Object.keys(input).length === 0;
};


$('body').on('product:afterAttributeSelect', function (e, response) {
    if (!isEmpty(response) && !isEmpty(response.data) && !isEmpty(response.data.fenixDeliveryEstimate)) {
        var fData = response.data;
        var fProduct = fData.product;
        var fResponse = fData.fenixDeliveryEstimate;

        if (!isEmpty(fProduct)) {
            if ((fProduct.productType !== 'variant') && (fProduct.productType !== 'product')) {
                return;
            }
        }

        $('.delivery-estimate').removeClass('fenixDeliveryError').html('');

        if (!isEmpty(fResponse.errorMessage)) {
            $('.delivery-estimate').addClass('fenixDeliveryError').html(fResponse.errorMessage);
        } else if (!isEmpty(fResponse.message)) {
            $('.delivery-estimate').html(fResponse.message);
        }
    }
});