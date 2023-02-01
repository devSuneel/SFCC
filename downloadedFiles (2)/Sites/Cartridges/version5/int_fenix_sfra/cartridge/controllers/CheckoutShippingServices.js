'use strict';

var server = require('server');
server.extend(module.superModule);

/**
 * Extends UpdateShippingMethodsList to show only Fenix Intelligent Delivery Estimate shipping Methods on Checkout Shipping page.
 */
server.append('UpdateShippingMethodsList', function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var Transaction = require('dw/system/Transaction');
    var AccountModel = require('*/cartridge/models/account');
    var OrderModel = require('*/cartridge/models/order');
    var ShippingHelper = require('*/cartridge/scripts/checkout/shippingHelpers');
    var Locale = require('dw/util/Locale');
    var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');
    var shipUUID = req.querystring.shipmentUUID || req.form.shipmentUUID;

    var currentBasket = BasketMgr.getCurrentBasket();

    var shipment;
    if (shipUUID) {
        shipment = ShippingHelper.getShipmentByUUID(currentBasket, shipUUID);
    } else {
        shipment = currentBasket.defaultShipment;
    }
    var address = ShippingHelper.getAddressFromRequest(req);

    var shippingMethodID;

    if (shipment.shippingMethod) {
        shippingMethodID = shipment.shippingMethod.ID;
    }

    Transaction.wrap(function () {
        var shippingAddress = shipment.shippingAddress;

        if (!shippingAddress) {
            shippingAddress = shipment.createShippingAddress();
        }

        Object.keys(address).forEach(function (key) {
            var value = address[key];
            if (value) {
                shippingAddress[key] = value;
            } else {
                shippingAddress[key] = null;
            }
        });

        ShippingHelper.selectShippingMethod(shipment, shippingMethodID);

        basketCalculationHelpers.calculateTotals(currentBasket);
    });

    var usingMultiShipping = req.session.privacyCache.get('usingMultiShipping');
    var currentLocale = Locale.getLocale(req.locale.id);

    var basketModel = new OrderModel(
        currentBasket, {
            usingMultiShipping: usingMultiShipping,
            countryCode: currentLocale.country,
            containerView: 'basket'
        }
    );

    res.json({
        customer: new AccountModel(req.currentCustomer),
        order: basketModel,
        shippingForm: server.forms.getForm('shipping')
    });

    return next();
});

/**
 * Extends SelectShippingMethod appending Fenix Intelligent Delivery Estimate shipping to Checkout Shipping Methods.
 */
server.append('SelectShippingMethod', server.middleware.https, function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var URLUtils = require('dw/web/URLUtils');
    var ShippingHelper = require('*/cartridge/scripts/checkout/shippingHelpers');
    var fenixIntelligentDeliveryUtils = require('*/cartridge/scripts/util/fenixIntelligentDeliveryUtils');
    var Site = require('dw/system/Site');
    var fDebug = Site.current.getCustomPreferenceValue('fenixDebug') || false;


    var viewData = res.getViewData();
    viewData.address = ShippingHelper.getAddressFromRequest(req);
    viewData.isGift = req.form.isGift === 'true';
    viewData.giftMessage = req.form.isGift ? req.form.giftMessage : null;
    res.setViewData(viewData);

    this.on('route:BeforeComplete', function (req, res) { // eslint-disable-line no-shadow
        var Resource = require('dw/web/Resource');
        var shippingData = res.getViewData();
        var shipments = shippingData.order.shipping;

        try {

            if (fenixIntelligentDeliveryUtils.isFenixIntelligentDeliveryEnabled()) {
                var fenixDeliveryEstimate = require('*/cartridge/models/product/fenixDeliveryEstimate');
                var viewData = res.getViewData();
                var currentBasket = BasketMgr.getCurrentBasket();

                if (!currentBasket) {
                    res.json({
                        error: true,
                        redirectUrl: URLUtils.url('Cart-Show').toString()
                    });
                    return next();
                }

                var fenixIntelligentDeliveryGetResponse = {};
                var deliveryPostalCode = fenixIntelligentDeliveryUtils.getDeliveryPostalCode(req.session, req.currentCustomer, ShippingHelper.getAddressFromRequest(req));

                fenixIntelligentDeliveryGetResponse = fenixIntelligentDeliveryUtils.getEstimates(currentBasket, null, deliveryPostalCode, Resource.msg('FenixIntelligentDelivery.CheckOut','fenixIntelligentDelivery','COP'));

                if (fenixIntelligentDeliveryUtils.isEmpty(fenixIntelligentDeliveryGetResponse) || fenixIntelligentDeliveryUtils.isEmpty(fenixIntelligentDeliveryGetResponse.Response)) {
                    if (fDebug) {
                        viewData.fenixDeliveryEstimate = {};
                        viewData.fenixDeliveryEstimate.errorMessage = fenixIntelligentDeliveryGetResponse.ErrorMsg;
                    }
                } else {
                    var fenixIntelligentDeliveryResponse = fenixIntelligentDeliveryUtils.deliveryEstimate(fenixIntelligentDeliveryGetResponse.Response);
                    var fGetItBy = Resource.msg('FenixIntelligentDelivery.ShippingCaption','fenixIntelligentDelivery','');

                    for (var i = 0; i < shipments.length; i++) {
                        var shippingMethods = shipments[i].applicableShippingMethods;
                
                        Object.keys(shippingMethods).forEach(function (shippingMethod) {
                            var lShippingMethod = shippingMethods[shippingMethod];
                            var lShippingMethodID = lShippingMethod.ID.toString();

                            if (!fenixIntelligentDeliveryUtils.isEmpty(fenixIntelligentDeliveryResponse.shipment[lShippingMethodID])) {
                                var fdescription =  fGetItBy + fenixIntelligentDeliveryResponse.shipment[lShippingMethod.ID].formattedDeliveryDate;
                                
                                if (!fenixIntelligentDeliveryUtils.isEmpty(fdescription)) {
                                    lShippingMethod.description = fdescription;
                                    lShippingMethod.estimatedArrivalTime = fdescription;
                                }
                            } else {
                                lShippingMethod.estimatedArrivalTime = lShippingMethod.description;
                            }
                        });
                    }
                }

                res.setViewData(viewData);

            }
        }catch (ex) {
            fenixIntelligentDeliveryUtils.logError('Error while getting Checkout Delivery Estimate', ex);
        }
    });

    return next();
});

module.exports = server.exports();
