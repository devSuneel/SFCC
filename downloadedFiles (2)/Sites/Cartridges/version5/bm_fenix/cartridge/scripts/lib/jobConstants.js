/**
 * Constants used in the cartridge
 * @returns {string} - Fenix Intelligent Constants
 */
function GetConstants() {
    var File = require("dw/io/File");
    var ProjectName = "FenixIntelligentDelivery";
   
    return {
        PROJECTNAME: ProjectName,

        LOGFILE: ProjectName,

        SEP: ',',

        BASEDIR: ProjectName,
        LOCALPRODUCTDIR: File.IMPEX + File.SEPARATOR + 'src' + File.SEPARATOR + ProjectName + File.SEPARATOR + 'product' + File.SEPARATOR,
        LOCALINVENTORYDIR: File.IMPEX + File.SEPARATOR + 'src' + File.SEPARATOR + ProjectName + File.SEPARATOR + 'inventory' + File.SEPARATOR,

        PRODUCTFILENAME: ProjectName,
        INVENTORYFILENAME: ProjectName + 'Inv',

        SFTPSERVICE: 'fenixDeliveryEstimate.push.sftp',
        ESTIMATESERVICE: 'lookupsdeliveryEstimates.get.http',

        DEFAULTINVENTORYLOCATION: 'L1',
        DEFAULTTHRESHOLD: 5,

        DEFAULTPOSTALCODE: '10001'
    };
}

module.exports = {
    getConstants: GetConstants
};