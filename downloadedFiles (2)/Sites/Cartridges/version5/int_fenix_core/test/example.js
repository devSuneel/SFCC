'use strict';
/* eslint-disable no-console */
/* globals console, describe, it */

var assert = require('chai').assert;
var sinon = require('sinon');
var proxyquire = require('proxyquire');
// var shippingHelpers = require('../cartridge/scripts/checkout/shippingHelpers');
var shippingHelpers = proxyquire('../cartridge/scripts/checkout/shippingHelpers', {});

describe('shippingHelpers', function() {
    describe('getApplicableShippingMethods', function() {

        it.only('should return a list of applicable shipping methods for null address', function() {
            var shipment = null;
            var address = null;
            var applicableShippingMethods = shippingHelpers.getApplicableShippingMethods(shipment, address);

            assert.equal(
                applicableShippingMethods[0].description,
                'Order received within 7-10 business days'
            );
            assert.equal(applicableShippingMethods[0].displayName, 'Ground');
            assert.equal(applicableShippingMethods[0].ID, '001');

            assert.equal(applicableShippingMethods[1].displayName, '2-Day Express');
            assert.equal(applicableShippingMethods[1].ID, '002');
        });
    });
});