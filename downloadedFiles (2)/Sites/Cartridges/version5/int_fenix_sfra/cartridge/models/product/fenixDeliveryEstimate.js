'use strict';

/**
 * Decorate an object(product model) with Fenix Delivery Estimate information
 * @param {Object} object - account Model to be decorated
 * @param {dw.customer.ProductList} fenixDelivery - Fenix Delivery Estimate Response
 *
 * @returns {Object} - Decorated product model
 */

module.exports = function deliveryEstimate(object, fenixDelivery) {
    var deliveryEstimateDecorator = require('*/cartridge/models/product/decorators/fenixDelivery');
    deliveryEstimateDecorator(object, fenixDelivery);
    return object;
};
