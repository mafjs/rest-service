var Rest = require('maf-rest');

module.exports = function (logger) {
    var rest = new Rest(logger.getLogger('rest'));

    return rest;
};
