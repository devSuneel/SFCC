'use strict';

module.exports = function (object, fenixIntelligentDeliveryGetResponse) {
    var fenixIntelligentDeliveryUtils = require('*/cartridge/scripts/util/fenixIntelligentDeliveryUtils');
    Object.defineProperty(object, 'fenixDeliveryEstimate', {
        enumerable: true,
        value: fenixIntelligentDeliveryUtils.deliveryEstimate(fenixIntelligentDeliveryGetResponse)
    });
};
