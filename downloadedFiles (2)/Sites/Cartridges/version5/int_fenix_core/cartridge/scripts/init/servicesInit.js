/**
 * Initialize HTTP services for a cartridge
 */
var system = require('dw/system');
var svc = require('dw/svc');

/**
 *
 * Look up Delivery Estimates
 *
 */
var myFenixIntelligentDeliveryService = svc.LocalServiceRegistry.createService('FenixIntelligentDelivery.get.http', {
    createRequest: function (fsvc, requestObj) {
        fsvc.addHeader('Content-Type', 'application/json');
        fsvc.addHeader('tenantId', system.Site.current.preferences.custom.fenixTenantID);
        fsvc.client.enableCaching(1000);
        fsvc.setRequestMethod('POST');
        return requestObj;
    },
    parseResponse: function (svc, client) {
        return client.text;
    },
    mockCall: function () {
        return {
            statusCode: 200,
            statusMessage: 'Success',
            text: JSON.stringify(
                [{
                    webId: '10294',
                    hours: '21',
                    minutes: '25',
                    carrier: 'FEDEX',
                    response: 'Get it by Wed, 08 Apr 2020.',
                    shippingCost: null,
                    shipperLocId: 'L1',
                    buyerZipCode: '95129',
                    shipperZipCode: '08512',
                    shippingMethod: 'STANDARD_OVERNIGHT',
                    shippingDateTime: '01 Apr 2020, 20:00',
                    actualMethodDesc: 'STANDARD_OVERNIGHT',
                    shippingMethodDesc: '003',
                    formattedDeliveryDate: 'Wednesday, Apr 08',
                    guaranteedDeliveryDate: 'Wed, 08 Apr 2020',
                    errorMessage: null,
                    packages: [{
                        carrier: 'FEDEX',
                        wrapperType: 'DEFAULT',
                        shipperZipCode: '08512',
                        actualMethodDesc: 'STANDARD_OVERNIGHT',
                        contents: {
                            10294: 1
                        }
                    }],
                    shippingDeliveryDate: 'Wed, 08 Apr 2020'
                },
                {
                    webId: '11231',
                    hours: '23',
                    minutes: '55',
                    carrier: 'FEDEX',
                    response: 'Get it by Wed, 03 Apr 2020.',
                    shippingCost: null,
                    shipperLocId: 'L2',
                    buyerZipCode: '95129',
                    shipperZipCode: '94952',
                    shippingMethod: 'GND',
                    shippingDateTime: '01 Jul 2020, 20:00',
                    actualMethodDesc: 'FEDEX_GROUND',
                    shippingMethodDesc: '001',
                    formattedDeliveryDate: 'Wednesday, Jul 3',
                    guaranteedDeliveryDate: 'Wed, 03 Jul 2020',
                    errorMessage: null,
                    packages: [{
                        carrier: 'FEDEX',
                        wrapperType: 'DEFAULT',
                        shipperZipCode: '94952',
                        actualMethodDesc: 'FEDEX_GROUND',
                        contents: {
                            11231: 1
                        }
                    }],
                    shippingDeliveryDate: 'Wed, 03 Jul 2020'
                }
                ]
            )
        };
    },
    filterLogMessage: function (msg) {
        //  No need to filter logs.  No sensitive information.
        return msg;
    }
});

module.exports.FenixIntelligentDelivery = myFenixIntelligentDeliveryService;
