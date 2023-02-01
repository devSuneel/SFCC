/* globals dw */
var system = require('dw/system');
var catalog = require('dw/catalog');
var io = require('dw/io');
var util = require('dw/util');

var jobConstants = require('../lib/jobConstants').getConstants();

var Logger = require('dw/system/Logger').getLogger(jobConstants.PROJECTNAME, 'fenixUploadFeed.js');
var Status = require('dw/system/Status');

var products;
var fileWriter;
var count = 0;
var tenantID;
var SEP;
var threshold;
var locationID;

/**
 *	Job Code to Export Inventory to a Local Server Path
 *
 *   Parameters:
 *	@param Enabled 			: Boolean 	Enable Inventory Exports
 *	@param FieldSeparator 	: String 	A string parameter used as the separation between fields
 *	@param FileName 		: String 	A string parameter used as the base for export filename
 *
 **/
function beforeStep(parameters, stepExecution) {  // eslint-disable-line no-unused-vars
  
    var enabled = parameters.Enabled;
    if (!enabled) {
        return new Status(Status.OK);
    }

    tenantID = dw.system.Site.current.preferences.custom.fenixTenantID;
    if (isEmpty(tenantID)) {
        return new Status(Status.ERROR);
    }

    try {
        threshold = dw.system.Site.current.preferences.custom.fenixInventoryThreshold;
        threshold = isEmpty(threshold) ? jobConstants.DEFAULTTHRESHOLD : threshold;

        locationID = dw.system.Site.current.preferences.custom.fenixInventorylocation;
        locationID = isEmpty(locationID) ? jobConstants.DEFAULTINVENTORYLOCATION : locationID;

        var filePref = !isEmpty(parameters.FileName) ? parameters.FileName : jobConstants.INVENTORYFILENAME;
        filePref += "_"+dw.system.Site.current.ID;
            
        SEP = !isEmpty(parameters.FieldSeparator) ? parameters.FieldSeparator : jobConstants.SEP;

        var filePath = new io.File(jobConstants.LOCALINVENTORYDIR);
        filePath.mkdirs();

        var file = new io.File(filePath, filePref + "_" + util.StringUtils.formatCalendar(system.System.getCalendar(), 'yyyyMMddhhmm'));
        fileWriter = new io.FileWriter(file);

        products = getProductList();

        var tempString = "SKU" + SEP;
        tempString += "TENANT_ID" + SEP;
        tempString += "LOCATION_ID" + SEP;
        tempString += "AVAILABLE_QTY" + SEP;
        tempString += "THRESHOLD";

        fileWriter.writeLine(tempString);
    } catch (ex) {
        Logger.error('Exception caught during inventory feed export: {0}', ex.toString());
        return new Status(Status.ERROR);
    }

}

/**
 *  Required Template Function to get global var with total count
 *
 *  Default functionality is to return products.count;
 **/
function getTotalCount(parameters, stepExecution) {  // eslint-disable-line no-unused-vars
    return count;
}

/**
 *  Required Template Function to get a product
 **/
function read(parameters, stepExecution) {  // eslint-disable-line no-unused-vars
    if (products && products.hasNext()) {
        count++;
        return products.next().getProduct();
    }
}

/**
 *  Required Template Function to process one product and return line for export
 **/
function process(product, parameters, stepExecution) {  // eslint-disable-line no-unused-vars
    if (product.isOnline()) {
        return getCatLine(product);
    }
}

/**
 *  Required Template Function to wite out one product line
 **/
function write(lines, parameters, stepExecution) {  // eslint-disable-line no-unused-vars
    for (var i = 0; i < lines.size(); i++) {
        fileWriter.writeLine(lines.get(i));
    }
}

/**
 *  Required Template Function for Step Closure
 **/
function afterStep(success, parameters, stepExecution) {  // eslint-disable-line no-unused-vars
    if (fileWriter) {
        fileWriter.close();
    }
}

/**
 *  Required Template Function to get all the catalog products
 *
 *  Default method for getting products:   catalog.ProductMgr.queryAllSiteProducts();
 **/
function getProductList() {
    var siteCatalog = catalog.CatalogMgr.getSiteCatalog();
    var root = siteCatalog.getRoot();

    var psm = new catalog.ProductSearchModel();

    psm.setCategoryID(root.ID);
    psm.setRecursiveCategorySearch(true);
    psm.setOrderableProductsOnly(true);
    psm.search();

    return psm.getProductSearchHits();
}

/**
 *	Function formats the export line
 **/
function getCatLine(LoopProduct) {
    var styleNumber = LoopProduct.ID;
    var quantity = getQuantity(LoopProduct);

    //  -----------------------------------------------------					
    // SKU	TENANT_ID	LOCATION_ID	AVAILABLE_QTY	THRESHOLD

    var tempString = styleNumber + SEP;
    tempString += tenantID + SEP;
    tempString += locationID + SEP;
    tempString += quantity + SEP;
    tempString += threshold;

    return tempString;
}

/**
 *	Get inventory count for the product
 **/
function getQuantity(product) {
    var quant = 0;
    Object.keys(product.variationModel.variants).forEach(function (variant) {
        if (!isEmpty(variant.availabilityModel)) {
            if (!isEmpty(variant.availabilityModel.inventoryRecord)) {
                quant += variant.availabilityModel.inventoryRecord.ATS.value;
            }
        }
    });
    return quant;
}

/* 
* Checks whether an object is empty, with checks for String, Array and Object.
* @param {obj} The object to check.
* @returns {boolean}  Is the obj Empty: true / false
*/
function isEmpty(obj) {
    if (obj === null) return true;
    if (typeof (obj) === 'undefined') return true;
    if (typeof (obj) === 'string') {
        return obj.value === "";
    }
    if(typeof (obj) === 'object'){
        var key;
        for (key in obj)
            return (false);
        return (true);
    }
    if (!obj) return true;
 
    return false;
}

module.exports = {
    beforeStep: beforeStep,
    getTotalCount: getTotalCount,
    read: read,
    process: process,
    write: write,
    afterStep: afterStep
};