require('source-map-support').install();

require('maf-error/initGlobal');

const Service = require('./Service');

/**
 * @private
 * @param {String} name
 * @param {?Object} rawConfig
 * @return {RestService}
 */
module.exports = function restServiceCreateService(name, rawConfig) {
    const service = new Service(name, rawConfig);

    return service;
};
