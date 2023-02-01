'use strict';

var server = require('server');
server.extend(module.superModule);

/**
 * Extend Main entry point for Checkout
 */
server.append('Begin', function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var Site = require('dw/system/Site');
    var fDebug = Site.current.getCustomPreferenceValue('fenixDebug') || false;

    var currentBasket = BasketMgr.getCurrentBasket();
    if (!currentBasket) return next();
    var viewData = res.getViewData();
    var fenixIntelligentDeliveryUtils = require('*/cartridge/scripts/util/fenixIntelligentDeliveryUtils');

    try {
        var Resource = require('dw/web/Resource');

        if (fenixIntelligentDeliveryUtils.isFenixIntelligentDeliveryEnabled()) {
            var fenixDeliveryEstimate = require('*/cartridge/models/product/fenixDeliveryEstimate');
            var fenixIntelligentDeliveryGetResponse = {};
            var deliveryPostalCode = fenixIntelligentDeliveryUtils.getDeliveryPostalCode(req.session, req.currentCustomer, null);

            if (fenixIntelligentDeliveryUtils.isFenixIntelligentDeliveryEnabled()) {
                fenixIntelligentDeliveryGetResponse = fenixIntelligentDeliveryUtils.getEstimates(currentBasket, null, deliveryPostalCode, Resource.msg('FenixIntelligentDelivery.CheckOut', 'fenixIntelligentDelivery', 'COP'));
                if (!fenixIntelligentDeliveryGetResponse.Response) {
                    if (fDebug) {
                        viewData.fenixDeliveryEstimate = {};
                        viewData.fenixDeliveryEstimate.errorMessage = fenixIntelligentDeliveryGetResponse.ErrorMsg;
                    }
                } else {
                    fenixDeliveryEstimate(viewData, fenixIntelligentDeliveryGetResponse.Response);
                }
            }

            res.setViewData(viewData);
        }
    } catch (ex) {
        fenixIntelligentDeliveryUtils.logError('Error while getting PDP Delivery Estimate', ex);
    }
    return next();
});

module.exports = server.exports();
