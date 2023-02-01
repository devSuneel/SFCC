/**
 * Calling the actual service and handling the Demandware service framework response.
 *
 * Usage:
 * var fenixIntelligentDeliveryGet = require('cartridge/scripts/api/pipelets/fenixIntelligentDeliveryGet');
 * var fenixIntelligentDeliveryGetResponse = fenixIntelligentDeliveryGet.fenixIntelligentDeliveryGet(requestPayload);
 *
 */

var system = require('dw/system');
var MiddlewareApi = require('*/cartridge/scripts/api/middlewareApi');
var fenixConstants = require('*/cartridge/scripts/lib/fenixConstants').getConstants();

/**
 * Get Fenix Intelligent Delivery Response from Web Service
 * @param {string} jsonPayload - the Payload for the request
 * @returns {Object}  - Fenix Intelligent Delivery Response Object
 */
function fenixIntelligentDeliveryGet(jsonPayload) {
    var api = new MiddlewareApi();
    var result;
    var response = [];

    try {
        result = api.fenixIntelligentDelivery(jsonPayload);
    } catch (e) {
        response.ErrorMsg = e.message;
    } finally {
        if ((result !== null && result !== {}) && result.isOk()) {
            response.Response = JSON.parse(result.object);
        } else if (response.ErrorMsg === null && response.ErrorMsg === '') {
            response.ErrorMsg = 'Some error occured';
            system.Logger.getLogger(fenixConstants.PROJECTNAME, 'fenixIntelligentDeliveryGet');
        }
    }

    return response;
}

module.exports = {
    fenixIntelligentDeliveryGet: fenixIntelligentDeliveryGet
};
