'use strict';

var File = require('dw/io/File');
var Status = require('dw/system/Status');
var ServiceRegistry = require('dw/svc/LocalServiceRegistry');

var jobConstants = require('../lib/jobConstants').getConstants();

var Logger = require('dw/system/Logger').getLogger(jobConstants.PROJECTNAME, 'fenixUploadFeed.js');

/**
 *	Job Code to Upload Product and Inventory files from a  Local Path to the Remote Folder Path
 *
 *   Parameters:
 *	@param Enabled 			: Boolean 	Enable Upload of Catalog and Inventory Exports
 *	@param ProductDIR 		: String 	String parameter, Remote path to which the Product CSV is Upload
 *	@param InventoryDIR 	: String 	String parameter, Remote path to which the Product CSV is Upload 
 *
 **/
function execute(parameters, stepExecution) {  // eslint-disable-line no-unused-vars
    var enabled = parameters.Enabled;
    if (!enabled) {
        return new Status(Status.OK);
    }

    try {

        var localProductDir = new File(jobConstants.LOCALPRODUCTDIR);
        localProductDir.mkdirs();

        var localInventoryDir = new File(jobConstants.LOCALINVENTORYDIR);
        localInventoryDir.mkdirs();

        var remoteProductDir = parameters.ProductDIR;

        var remoteInventoryDir = parameters.InventoryDIR;

        if (isEmpty(remoteProductDir) || isEmpty(remoteInventoryDir)) {
            Logger.error('Upload Directory for sftp server not defined,  Product Dir: {0}, Inventory Dir: {1}', remoteProductDir, remoteInventoryDir);
            return;
        }

        remoteProductDir = remoteProductDir.indexOf(File.SEPARATOR, remoteProductDir.length) > 0 ? remoteProductDir : (remoteProductDir + File.SEPARATOR);
        remoteInventoryDir = remoteInventoryDir.indexOf(File.SEPARATOR, remoteInventoryDir.length) > 0 ? remoteInventoryDir : (remoteInventoryDir + File.SEPARATOR);

        var service = ServiceRegistry.get(jobConstants.SFTPSERVICE);
        var result = pushFile(service, localProductDir, remoteProductDir);

        if (result.isError()) {
            Logger.error('Problem testing sftp server. path: {0}, result: {1}', remoteProductDir, result.toString());
            return new Status(Status.ERROR);
        }

        result = pushFile(service, localInventoryDir, remoteInventoryDir);

        if (result.isError()) {
            Logger.error('Problem testing sftp server. path: {0}, result: {1}', remoteInventoryDir, result.toString());
            return new Status(Status.ERROR);
        }
 
    } catch (ex) {
        Logger.error('Exception caught during product feed upload: {0}', ex.toString());
        return new Status(Status.ERROR);
    } 

    return new Status(Status.OK);
}

/**
 *	Copy a Local File to the Remote Folder Path
 *	@param service 			: Object 	SFTP Client Server for the Upload
 *	@param localPath 		: File 		The file to copy
 *	@param remotePath 		: File 	Flag if files should be archived after successful copying 
 *
 **/
function pushFile(service, localPath, remotePath) {

    var localFiles = localPath.listFiles();
    var result = service.setOperation('cd', remotePath).call();
    if (!result.isOk()) {
        Logger.error('Problem testing sftp server. path: {0}, result: {1}', remotePath, result.toString());
        return new Status(Status.ERROR);
    }

    for (var i = 0; i < localFiles.length; i++) {
        var file = localFiles[i];

        result = service.setOperation('putBinary', remotePath + file.name, file).call();
        if (!result.isOk()) {
            Logger.error('Problem uploading file: ' + result.toString());
            return new Status(Status.ERROR);
        } else {
            file.remove();
        }
    }

    return new Status(Status.OK);
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

module.exports.execute = execute;