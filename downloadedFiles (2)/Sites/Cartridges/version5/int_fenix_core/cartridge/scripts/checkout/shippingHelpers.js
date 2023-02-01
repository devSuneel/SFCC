/* globals module */
'use strict';

var base = module.superModule; // eslint-disable-line no-unused-vars

/**
 * Plain JS object that represents a DW Script API dw.order.ShippingMethod object
 * @param {dw.order.Shipment} shipment - the target Shipment
 * @param {Object} [address] - optional address object
 * @returns {dw.util.Collection} an array of ShippingModels
 */
function getApplicableShippingMethods(shipment, address) {
    var ShippingMgr = require('dw/order/ShippingMgr');
    var ShippingMethodModel = require('*/cartridge/models/shipping/shippingMethod');
    var BasketMgr = require('dw/order/BasketMgr');
    var basket = BasketMgr.getCurrentBasket();
    var shipmentShippingModel = ShippingMgr.getShipmentShippingModel(shipment);
    var shippingMethods;
    var fenixIntelligentDeliveryGetResponse;
    var fenixIntelligentDeliveryUtils = require('*/cartridge/scripts/util/fenixIntelligentDeliveryUtils');

    if (!shipment) return null;

    if (address) {
        shippingMethods = shipmentShippingModel.getApplicableShippingMethods(address);
    } else {
        shippingMethods = shipmentShippingModel.getApplicableShippingMethods();
    }

    /* istanbul ignore if */
    if (fenixIntelligentDeliveryUtils.isFenixIntelligentDeliveryEnabled()) {
        var Resource = require('dw/web/Resource');
        var deliveryPostalCode = fenixIntelligentDeliveryUtils.getDeliveryPostalCode(null, null, address);

        /**
        * Change here to limit Fenix Delivery Estimates to specific locales, pass in the country code and modify the function in cartridges/int_fenix_core/cartridge/scripts/util/fenixIntelligentDeliveryUtils.js
        * var isFenixIntelligentDeliveryEnabled = fenixIntelligentDeliveryUtils.isFenixIntelligentDeliveryEnabled(request.httpParameterMap.countryCode.submitted ? request.httpParameterMap.countryCode.stringValue : '');
        * if (isFenixIntelligentDeliveryEnabled && !empty(deliveryPostalCode)) {
        **/
        if (deliveryPostalCode) {
            fenixIntelligentDeliveryGetResponse = fenixIntelligentDeliveryUtils.getDeliveryResonseObject(fenixIntelligentDeliveryUtils.getEstimates(basket, null, deliveryPostalCode, Resource.msg('FenixIntelligentDelivery.CheckOut', 'fenixIntelligentDelivery', 'COP')));
            shippingMethods = fenixIntelligentDeliveryUtils.getApplicableShippingMethods(shippingMethods, fenixIntelligentDeliveryGetResponse);
        }
    }

    return shippingMethods.toArray().map(function (shippingMethod) {
        return new ShippingMethodModel(shippingMethod, shipment);
    });
}

module.exports = {
    getShippingModels: base.getShippingModels,
    selectShippingMethod: base.selectShippingMethod,
    ensureShipmentHasMethod: base.ensureShipmentHasMethod,
    getShipmentByUUID: base.getShipmentByUUID,
    getAddressFromRequest: base.getAddressFromRequest,
    getApplicableShippingMethods: getApplicableShippingMethods
};
