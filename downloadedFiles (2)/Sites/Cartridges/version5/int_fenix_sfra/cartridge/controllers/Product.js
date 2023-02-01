'use strict';

var server = require('server');
server.extend(module.superModule);

/**
 * Extends Product-Variation controller to show Fenix Intelligent Delivery Estimate on product details page.
 */
server.append('Variation', function (req, res, next) {
    var ProductMgr = require('dw/catalog/ProductMgr');
    var fenixIntelligentDeliveryUtils = require('*/cartridge/scripts/util/fenixIntelligentDeliveryUtils');
    var Resource = require('dw/web/Resource');
    var Site = require('dw/system/Site');
    var fDebug = Site.current.getCustomPreferenceValue('fenixDebug') || false;

    try {
        if (fenixIntelligentDeliveryUtils.isFenixIntelligentDeliveryEnabled()) {
            var fenixDeliveryEstimate = require('*/cartridge/models/product/fenixDeliveryEstimate');
            var viewData = res.getViewData();
            var apiProduct = ProductMgr.getProduct(viewData.product.id);
            var pid = (apiProduct.variant ? apiProduct.variationModel.master.ID : apiProduct.ID);

            if (!(apiProduct.isMaster() || apiProduct.isVariationGroup() || apiProduct.isProductSet())) {
                var fenixIntelligentDeliveryGetResponse = {};
                var deliveryPostalCode = fenixIntelligentDeliveryUtils.getDeliveryPostalCode(req.session, req.currentCustomer, null);

                if (fenixIntelligentDeliveryUtils.isFenixIntelligentDeliveryEnabled()) {
                    fenixIntelligentDeliveryGetResponse = fenixIntelligentDeliveryUtils.getEstimates(null, pid, deliveryPostalCode, Resource.msg('FenixIntelligentDelivery.PDP', 'fenixIntelligentDelivery', 'PDP'));

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
        }
    } catch (ex) {
        fenixIntelligentDeliveryUtils.logError('Error while getting PDP Delivery Estimate', ex);
    }

    next();
});


/**
 * Extends Product-Variation controller to show Fenix Intelligent Delivery Estimate on product details page.
 */
server.append('Show', function (req, res, next) {
    var ProductMgr = require('dw/catalog/ProductMgr');
    var fenixIntelligentDeliveryUtils = require('*/cartridge/scripts/util/fenixIntelligentDeliveryUtils');
    var Resource = require('dw/web/Resource');

    try {
        if (fenixIntelligentDeliveryUtils.isFenixIntelligentDeliveryEnabled()) {
            var fenixDeliveryEstimate = require('*/cartridge/models/product/fenixDeliveryEstimate');
            var viewData = res.getViewData();
            var apiProduct = ProductMgr.getProduct(viewData.product.id);
            var pid = (apiProduct.variant ? apiProduct.variationModel.master.ID : apiProduct.ID);

            if (!(apiProduct.isMaster() || apiProduct.isVariationGroup() || apiProduct.isProductSet())) {
                var fenixIntelligentDeliveryGetResponse = {};
                var deliveryPostalCode = fenixIntelligentDeliveryUtils.getDeliveryPostalCode(req.session, req.currentCustomer, null);

                if (fenixIntelligentDeliveryUtils.isFenixIntelligentDeliveryEnabled()) {
                    fenixIntelligentDeliveryGetResponse = fenixIntelligentDeliveryUtils.getEstimates(null, pid, deliveryPostalCode, Resource.msg('FenixIntelligentDelivery.PDP', 'fenixIntelligentDelivery', 'PDP'));
                }

                fenixDeliveryEstimate(viewData, fenixIntelligentDeliveryGetResponse.Response);
                res.setViewData(viewData);
            }
        }
    } catch (ex) {
        fenixIntelligentDeliveryUtils.logError('Error while getting PDP Delivery Estimate', ex);
    }
    next();
});

module.exports = server.exports();
