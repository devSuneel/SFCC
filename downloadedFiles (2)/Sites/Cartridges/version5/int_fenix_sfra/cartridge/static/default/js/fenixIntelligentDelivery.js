/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/int_fenix_sfra/cartridge/client/default/js/fenixIntelligentDelivery.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/int_fenix_sfra/cartridge/client/default/js/fenixIntelligentDelivery.js":
/*!*******************************************************************************************!*\
  !*** ./cartridges/int_fenix_sfra/cartridge/client/default/js/fenixIntelligentDelivery.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* eslint-disable no-undef */\n\n\n\n/**\n * Registering on change event on variant selected.\n */\n\nvar isEmpty = function (input) {\n    if (input == null) { return true; }\n\n    if (typeof input === 'object') {\n        return input.length === 0;\n    }\n\n    return !input || Object.keys(input).length === 0;\n};\n\n\n$('body').on('product:afterAttributeSelect', function (e, response) {\n    if (!isEmpty(response) && !isEmpty(response.data) && !isEmpty(response.data.fenixDeliveryEstimate)) {\n        var fData = response.data;\n        var fProduct = fData.product;\n        var fResponse = fData.fenixDeliveryEstimate;\n\n        if (!isEmpty(fProduct)) {\n            if ((fProduct.productType !== 'variant') && (fProduct.productType !== 'product')) {\n                return;\n            }\n        }\n\n        $('.delivery-estimate').removeClass('fenixDeliveryError').html('');\n\n        if (!isEmpty(fResponse.errorMessage)) {\n            $('.delivery-estimate').addClass('fenixDeliveryError').html(fResponse.errorMessage);\n        } else if (!isEmpty(fResponse.message)) {\n            $('.delivery-estimate').html(fResponse.message);\n        }\n    }\n});\n\n//# sourceURL=webpack:///./cartridges/int_fenix_sfra/cartridge/client/default/js/fenixIntelligentDelivery.js?");

/***/ })

/******/ });