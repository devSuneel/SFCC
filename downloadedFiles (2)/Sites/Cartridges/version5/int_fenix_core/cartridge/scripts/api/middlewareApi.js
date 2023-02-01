/**
 * MiddlewareApi
 *
 * Usage:
 * var MiddlewareApi = require('/cartridge/scripts/api/middlewareApi');
 * var api = new MiddlewareApi();
 *
 */
var servicesInit = require('*/cartridge/scripts/init/servicesInit');
var svc = require('dw/svc');

/* ***********************************
 * PRIVATE AREA
 ********************************** */

/**
 * ProcessMiddleware Response
 * @param {dw.svc.Service} service - Middleware Service
 * @param {Object} result - Middleware Response
 * @returns {string} - If there is an Error Return the error message
 */
function processResponse(service, result) {
    var errorMsg;
    if ((typeof result.object === 'string') && (result.object.slice(0, 6) === 'Error:')) {
        errorMsg = 'Service: ' + service.credentialID + ' Status: ' + result.status + ' Message: ' + result.object;
    } else if (result.status === svc.Result.SERVICE_UNAVAILABLE) {
        errorMsg = 'Service: ' + service.credentialID + ' Status: ' + result.status + ' Message: ' + (result.errorMessage || result.msg);
    } else if (result.status === svc.Result.ERROR) {
        errorMsg = 'Service Result Error: ' + service.credentialID + ', Status: ' + result.status + ', result.msg: ' + result.msg + ', result.errorMessage: ' + result.errorMessage;
    }
    return errorMsg;
}

/**
 * Make Middleware Call
 *
 * @param {dw.svc.Service} service - Middleware Service
 * @param {Object} requestBody - Middleware Request Payload
 * @returns {Object} - Middleware Response
 */
function makeCall(service, requestBody) {
    var request = requestBody || {};
    var result;

    result = service.call(request);

    var errorMsg = processResponse(service, result);

    if (errorMsg) {
        throw new Error(errorMsg);
    }

    return result;
}

/* ***********************************
 * PUBLIC AREA
 ********************************** */

/**
 * Constructor
 */
function MiddlewareApi() { }

/*
 *  Look up Delivery Estimates
 * @param {String} jsonPayload - the Payload for the request
 * @returns {Object}  - Fenix Intelligent Delivery Response Object
 */
MiddlewareApi.prototype.FenixIntelligentDelivery = function (jsonPayload) {
    var request = jsonPayload;
    var service = servicesInit.FenixIntelligentDelivery;
    var result;

    result = makeCall(service, request);

    return result;
};

module.exports = MiddlewareApi;
