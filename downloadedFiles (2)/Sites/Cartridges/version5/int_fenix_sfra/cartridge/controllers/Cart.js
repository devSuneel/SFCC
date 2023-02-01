'use strict';
var server = require('server');
server.extend(module.superModule);

server.append('MiniCartShow', function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var currentBasket = BasketMgr.getCurrentBasket();
    var Site = require('dw/system/Site');
    var fDebug = Site.current.getCustomPreferenceValue('fenixDebug') || false;

    if (currentBasket) {
        var fenixIntelligentDeliveryUtils = require('*/cartridge/scripts/util/fenixIntelligentDeliveryUtils');
        try {
            if (fenixIntelligentDeliveryUtils.isFenixIntelligentDeliveryEnabled()) {
                var fenixDeliveryEstimate = require('*/cartridge/models/product/fenixDeliveryEstimate');
                var viewData = res.getViewData();
                var fenixIntelligentDeliveryGetResponse = {};
                var Resource = require('dw/web/Resource');
                var deliveryPostalCode = fenixIntelligentDeliveryUtils.getDeliveryPostalCode(req.session, req.currentCustomer, null);
                if (fenixIntelligentDeliveryUtils.isFenixIntelligentDeliveryEnabled()) {
                    fenixIntelligentDeliveryGetResponse = fenixIntelligentDeliveryUtils.getEstimates(currentBasket, null, deliveryPostalCode, Resource.msg('FenixIntelligentDelivery.MiniCart', 'fenixIntelligentDelivery', 'mc'));
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
    }
    next();
});

server.append('Show', function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var currentBasket = BasketMgr.getCurrentBasket();
    var Site = require('dw/system/Site');
    var fDebug = Site.current.getCustomPreferenceValue('fenixDebug') || false;

    if (currentBasket) {
        var fenixIntelligentDeliveryUtils = require('*/cartridge/scripts/util/fenixIntelligentDeliveryUtils');
        try {
            if (fenixIntelligentDeliveryUtils.isFenixIntelligentDeliveryEnabled()) {
                var fenixDeliveryEstimate = require('*/cartridge/models/product/fenixDeliveryEstimate');
                var viewData = res.getViewData();
                var fenixIntelligentDeliveryGetResponse = {};
                var Resource = require('dw/web/Resource');
                var deliveryPostalCode = fenixIntelligentDeliveryUtils.getDeliveryPostalCode(req.session, req.currentCustomer, null);
                if (fenixIntelligentDeliveryUtils.isFenixIntelligentDeliveryEnabled()) {
                    fenixIntelligentDeliveryGetResponse = fenixIntelligentDeliveryUtils.getEstimates(currentBasket, null, deliveryPostalCode, Resource.msg('FenixIntelligentDelivery.Cart', 'fenixIntelligentDelivery', 'Cart'));
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
    }
    next();
});
module.exports = server.exports();
