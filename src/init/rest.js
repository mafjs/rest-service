const Rest = require('maf-rest');

module.exports = function restServiceInitRest(logger) {
    return new Rest(logger.getLogger('rest'));
};
