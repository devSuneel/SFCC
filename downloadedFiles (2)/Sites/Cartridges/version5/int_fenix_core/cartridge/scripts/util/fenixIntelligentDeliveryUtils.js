/* globals session, request */
/**
 * Script Util file for getting delivery estimates and creating API request
 *
 * Usage:
 * importScript( "/util/fenixIntelligentDeliveryUtils.js" );
 * var fenixIntelligentDeliveryGetResponse = fenixIntelligentDeliveryUtils.getEstimates(basket, pdpSKU, buyerZipCode, pageType, sessionTrackId);
 *
 */

var System = require('dw/system');
var Catalog = require('dw/catalog');
var Logger = require('dw/system/Logger');
var fenixConstants = require("*/cartridge/scripts/lib/fenixConstants").getConstants();
var ArrayList = require('dw/util/ArrayList');
var HashMap = require('dw/util/HashMap');


/**
 * Is Fenix intelligent Delivery Enabled.
 *
 * Modify the code here if you have to check for Country or other determination of Storefront availablility of this functionality.
 *
 * @CountryCode
 * @return {Boolean} true if shipments are successfully prepared, false if they are not.
 */
function isFenixIntelligentDeliveryEnabled() {
    return System.Site.current.preferences.custom.fenixEnabled;
}

/**
 * Is Fenix intelligent Delivery Enabled for this storefront.
 *
 * Modify the code here if you have to check for Country or other determination of Storefront availablility of this functionality.
 *
 * @CountryCode
 * @return {Boolean} true if shipments are successfully prepared, false if they are not.
 */
function isFenixDeliveryEstimateEnabled() {
    return System.Site.current.preferences.custom.fenixEnabled;
}

/**
 * Get Customer's Postal code.
 *
 * @Request
 * @Session
 * @Customer
 * @Address
 * @return {String} Customer's Postal Code.
 */

function getDeliveryPostalCode(fSession, fCustomer, fAddress) {
    var deliveryPostalCode;

    if (!isEmpty(fAddress)) {
        if (!isEmpty(fAddress.postalCode)) {
            deliveryPostalCode = fAddress.postalCode;
        }
    } else if (fCustomer && fCustomer.authenticated) {
        deliveryPostalCode = !isEmpty(fCustomer.profile.addressBook.preferredAddress) ? (fCustomer.profile.addressBook.preferredAddress.postalCode) : (fCustomer.profile.addressBook.addresses[0].postalCode);
    } else if ((fSession != null) && (fSession.privacy && fSession.privacy.f_postal_code)) {
        deliveryPostalCode = fSession.privacy.f_postal_code;
    }
    if (isEmpty(deliveryPostalCode)) {
        deliveryPostalCode = request.geolocation.postalCode;
    }
    if (isEmpty(deliveryPostalCode)) {
        deliveryPostalCode = fenixConstants.DEFAULTPOSTALCODE;
    }
    return deliveryPostalCode;
}

/**
 * Get Fenix intelligent Delivery Response Shipping Methods.
 *
 * @FenixIntelligentDeliveryGotResponse
 * @return {Object} Shipping Methods from Response.
 */
function getDeliveryResonseObject(FenixIntelligentDeliveryGotResponse) {

    var fenixshipping = new HashMap();

    if (isFenixIntelligentDeliveryEnabled()) {

        if ((typeof FenixIntelligentDeliveryGotResponse.Response !== 'undefined') && (FenixIntelligentDeliveryGotResponse.Response.length > 0)) {
            var FenixIntelligentDeliveryResponse = FenixIntelligentDeliveryGotResponse.Response;

            if (FenixIntelligentDeliveryResponse == null) {
                return null;
            }

            var i;
            for (i = 0; i < FenixIntelligentDeliveryResponse.length; i++) {
                var f_raw_method = FenixIntelligentDeliveryResponse[i];

                if (!isEmpty(f_raw_method)) {

                    if (isEmpty(f_raw_method.errorMessage)) {
                        var f_response = f_raw_method.response;

                        var f_formattedDate = f_raw_method.formattedDeliveryDate;
                        var f_guaranteedDate = f_raw_method.guaranteedDeliveryDate;
                        var f_method = f_raw_method.shippingMethodDesc;
                        var f_packages = f_raw_method.packages;
                        var f_package = isEmpty(f_packages[0]) ? null : f_packages[0];
                        var f_display = isEmpty(f_package.actualMethodDesc) ? null : f_package.actualMethodDesc;

                        fenixshipping[f_method] = {
                            "response": f_response,
                            "display": f_display,
                            "formattedDate": f_formattedDate,
                            "guaranteedDate": f_guaranteedDate
                        };
                    }
                }
            }

        }
    }

    return fenixshipping;

}

/**
 * Filter Applicable Shipping Methods, and return only Shipping methods included 
 * in the  Fenix intelligent Delivery Response Shipping Methods.
 *
 * @applicableshipping
 * @deliveryResponse
 * @return {Object} Shipping Methods in Fenix intelligent Delivery Response.
 */
function getApplicableShippingMethods(applicableshipping, deliveryResponse) {
    var shippingmethods = new ArrayList();
    var showFreeShipID = System.Site.current.preferences.custom.fenixShowShipID ? System.Site.current.preferences.custom.fenixShowShipID : '';

    try {
        // var deliveryResponseMethod = {};

        if (!isEmpty(deliveryResponse)) {
            var i;
            for (i = 0; i < applicableshipping.length; i++) {
                var loopShipID = applicableshipping[i].ID;
                if (deliveryResponse.containsKey(loopShipID) || (loopShipID == showFreeShipID)) {
                    shippingmethods.add(applicableshipping[i]);
                }
            }
        }

    } catch (e) {
        logError("Error while executing getApplicableShippingMethods ", e);
    }

    if (!(shippingmethods.length > 0)) {
        shippingmethods = applicableshipping;
    }

    return shippingmethods;
}

/**
 * Filter Applicable Shipping Methods, and return only Shipping methods included 
 * in the  Fenix intelligent Delivery Response Shipping Methods.
 *
 * @applicableshipping
 * @deliveryResponse
 * @return {Object} Shipping Methods in Fenix intelligent Delivery Response.
 */
function fenixIntelligentDeliveryGet(jsonPayload){
    var MiddlewareApi = require("*/cartridge/scripts/api/middlewareApi");
    var api = new MiddlewareApi();
    var result;
    var response = [];

    try {
        result = api.FenixIntelligentDelivery(jsonPayload);
    } catch (e) {
        logError("Error while executing fenixIntelligentDeliveryGet ", e);
        response.ErrorMsg = e.message;
    } finally {
        if (!isEmpty(result) && result.isOk()) {
            response.Response = JSON.parse(result.object);
        } else {
            if (isEmpty(response.ErrorMsg)) {
                response.ErrorMsg = "Some error occured";
            }
        }
    }

    return response;
}


/**
 * @param {Basket} basket
 * @param {String} pdpSKU
 * @param {String} buyerZipCode
 * @param {String} pageType
 * @return {String}
 */
function getApiRequest(basket, pdpSKU, buyerZipCode, pageType) {
    var requestPayload = {};
    var skus = [];
    var sku = {};
    var defaultVariant;
    //var collections = require('*/cartridge/scripts/util/collections');

    if (pageType === "PDP") {
        defaultVariant = Catalog.ProductMgr.getProduct(pdpSKU).variationModel.getDefaultVariant();
        sku.quantity = 1;
        if (Catalog.ProductMgr.getProduct(pdpSKU).variant) {
            sku.sku = pdpSKU;
        } else {
            sku.sku = defaultVariant.ID;
        }
        skus.push(sku);
    } else {
        if (!isEmpty(basket)) {
            var basketItems = basket.getAllProductLineItems();
            Object.keys(basketItems).forEach(function (basketItem) {
                sku = {};
                sku.quantity = basketItem.quantityValue;
                sku.sku = basketItem.productID;
                skus.push(sku);
            });
        }
    }

    requestPayload.buyerZipCode = buyerZipCode;

    if (pageType === "PDP") {
        requestPayload.moneytoryValue = defaultVariant.getPriceModel().getPrice().value;
    } else {
        if (!isEmpty(basket)) {
            requestPayload.moneytoryValue = basket.adjustedMerchandizeTotalNetPrice.value;
        }
    }

    requestPayload.pageType = pageType;
    requestPayload.responseFormat = "json";
    requestPayload.sessionTrackId = session.sessionID;
    requestPayload.skus = skus;

    return JSON.stringify(requestPayload);
}

/**
 * @param {Basket} basket
 * @param {String} pdpSKU
 * @param {String} buyerZipCode
 * @param {String} pageType
 *
 */
function getEstimates(basket, pdpSKU, buyerZipCode, pageType) {
    var requestPayload = getApiRequest(basket, pdpSKU, buyerZipCode, pageType);
    var fenixIntelligentDeliveryGetResponse;
    fenixIntelligentDeliveryGetResponse = fenixIntelligentDeliveryGet(requestPayload);

    return fenixIntelligentDeliveryGetResponse;
}

/**
 * @param {String} message
 *
 */
function logError(message, error) {
    var FenixIntelligentDeliveryLogError = Logger.getLogger("FenixIntelligentDelivery", "fenixIntelligentDeliveryUtils.js");
    if (!isEmpty(error)) {
        FenixIntelligentDeliveryLogError.debug(message + '|' + error.message);
    } else {
        FenixIntelligentDeliveryLogError.debug(message);
    }
}

/**
 * add the last two items from the deliveryEstimate to the account model
 * @param {dw.Object} fenixIntelligentDeliveryGetResponse - Api Response from Fenix Communications
 * @returns {dw.Object} Delivery Estimate Response Object for Storefront
 */
function deliveryEstimate(FenixIntelligentDeliveryGetResponse) {
    var Resource = require('dw/web/Resource');
    var result = {};

    if (FenixIntelligentDeliveryGetResponse.length === 0) {
        result.errorMessage = FenixIntelligentDeliveryGetResponse.errorMessage;

        return result;
    }

    result.shipment = new Array();

    var i;
    for (i = 0; i < FenixIntelligentDeliveryGetResponse.length; i++) {
        var box = FenixIntelligentDeliveryGetResponse[i];

        if (box != null) {
            if (i === 0) {
                result.message = box.response;
                result.postalCode = box.buyerZipCode;
                result.errorMessage = box.errorMessage;
            }
            var shippingCaption = Resource.msg('FenixIntelligentDelivery.ShippingCaption', 'fenixIntelligentDelivery', '') + box.formattedDeliveryDate;

            result.shipment[box.shippingMethodDesc] = {
                carrier: box.carrier,
                response: shippingCaption,
                shippingCost: box.shippingCost,
                shipperLocId: box.shipperLocId,
                postalCode: box.buyerZipCode,
                shipperZipCode: box.shipperZipCode,
                shippingMethod: box.shippingMethod,
                shippingDateTime: box.shippingDateTime,
                actualMethodDesc: box.actualMethodDesc,
                shippingMethodDesc: box.shippingMethodDesc,
                formattedDeliveryDate: box.formattedDeliveryDate,
                guaranteedDeliveryDate: box.guaranteedDeliveryDate,
                errorMessage: box.errorMessage
            };
        } else if (i === 0) {
            result.message = box.response;
            result.postalCode = box.buyerZipCode;
            result.errorMessage = box.errorMessage;
        }
    }

    return result;
}



/* 
* Checks whether an object is empty, with checks for String, Array and Object.
* @param {obj} The object to check.
* @returns {boolean}  Is the obj Empty: true / false
*/
function isEmpty(obj) {
    if (obj === null) return true;
    if (typeof (obj) === 'undefined') return true;
    if (typeof (obj) === 'string') {
        return obj.value === "";
    }
    if(typeof (obj) === 'object'){
        var key;
        for (key in obj)
            return (false);
        return (true);
    }
    if (!obj) return true;
 
    return false;
}

module.exports = {
    isFenixIntelligentDeliveryEnabled: isFenixIntelligentDeliveryEnabled,
    isFenixDeliveryEstimateEnabled: isFenixDeliveryEstimateEnabled,
    getDeliveryPostalCode: getDeliveryPostalCode,
    getDeliveryResonseObject: getDeliveryResonseObject,
    getApplicableShippingMethods: getApplicableShippingMethods,
    fenixIntelligentDeliveryGet: fenixIntelligentDeliveryGet,
    getApiRequest: getApiRequest,
    getEstimates: getEstimates,
    deliveryEstimate: deliveryEstimate,
    isEmpty: isEmpty,
    logError: logError
};