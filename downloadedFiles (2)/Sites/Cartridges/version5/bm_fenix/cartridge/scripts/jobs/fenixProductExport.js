
/* globals dw */
var system = require('dw/system');
var catalog = require('dw/catalog');
var io = require('dw/io');
var util = require('dw/util');

var jobConstants = require('../lib/jobConstants').getConstants();

var products;
var fileWriter;
var count = 0;
var tenantID;
var SEP;

/**
 *	Job Code to Export Product to a Local Server Path
 *
 *   Parameters:
 *	@param Enabled 			: Boolean 	Enable Product Exports
 *	@param FieldSeparator 	: String 	A string parameter used as the separation between fields
 *	@param FileName 		: String 	A string parameter used as the base for export filename
 *
 **/
function beforeStep(parameters, stepExecution) {  // eslint-disable-line no-unused-vars
    var Logger = require('dw/system/Logger').getLogger(jobConstants.PROJECTNAME, 'fenixUploadFeed.js');
    var Status = require('dw/system/Status');

    var enabled = parameters.Enabled;
    
    if (!enabled) {
        return new Status(Status.OK);
    }

    tenantID = dw.system.Site.current.preferences.custom.fenixTenantID;
    if (isEmpty(tenantID)) {
        return new Status(Status.ERROR);
    }

    try {

        var filePref = !isEmpty(parameters.FileName) ? parameters.FileName : jobConstants.PRODUCTFILENAME;
        filePref += "_"+dw.system.Site.current.ID;

        SEP = !isEmpty(parameters.FieldSeparator) ? parameters.FieldSeparator : jobConstants.SEP;

        var filePath = new io.File(jobConstants.LOCALPRODUCTDIR);
        filePath.mkdirs();

        var file = new io.File(filePath, filePref + "_" + util.StringUtils.formatCalendar(system.System.getCalendar(), 'yyyyMMddhhmm'));
        fileWriter = new io.FileWriter(file);

        products = getProductList();

        var tempString = "SKU" + SEP;
        tempString += "TENANT_ID" + SEP;
        tempString += "CATEGORY_ID" + SEP;
        tempString += "CATEGORY_NAME" + SEP;
        tempString += "PRODUCT_ID" + SEP;
        tempString += "PRODUCT_NAME" + SEP;
        tempString += "HEIGHT" + SEP;
        tempString += "WIDTH" + SEP;
        tempString += "LENGTH" + SEP;
        tempString += "GIRTH" + SEP;
        tempString += "DIM_UNITS" + SEP;
        tempString += "WEIGHT" + SEP;
        tempString += "WEIGHT_UNITS" + SEP;

        fileWriter.writeLine(tempString);
    } catch (ex) {
        Logger.error('Exception caught during product feed export: {0}', ex.toString());
        return new Status(Status.ERROR);
    }
}

/**
 *  Required Template Function to get global var with total count
 *
 *  Default functionality is to return products.count;
 **/
function getTotalCount(parameters, stepExecution) {  // eslint-disable-line no-unused-vars
    // return products.count;
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
function getCatLine(LoopProduct){
    var tempString;

    //SKU
    tempString = LoopProduct.ID + SEP;

    //	TENANT_ID
    tempString += tenantID + SEP;

    //	CATEGORY_ID 
    tempString += !isEmpty(LoopProduct.classificationCategory) ? LoopProduct.classificationCategory.ID + SEP : SEP;

    //	CATEGORY_NAME
    tempString += !isEmpty(LoopProduct.classificationCategory) ? "\"" + LoopProduct.classificationCategory.displayName + "\"" + SEP : SEP;

    //	PRODUCT_ID 
    tempString += LoopProduct.ID + SEP;

    //	PRODUCT_NAME 
    tempString += "\"" + LoopProduct.name + "\"" + SEP;

    //  Edit below fields if Dimension Information is required for this site.

    //	HEIGHT 
    tempString += SEP;

    //	WIDTH 
    tempString += SEP;

    //	LENGTH 
    tempString += SEP;

    //	GIRTH 
    tempString += SEP;

    //	DIM_UNITS 
    tempString += SEP;

    //	WEIGHT 
    tempString += SEP;

    //	WEIGHT_UNITS 
    tempString += SEP;

    return tempString;
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