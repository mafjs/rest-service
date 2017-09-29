require('source-map-support').install();

require('maf-error/initGlobal');

const Service = require('./Service');

module.exports = function restServiceCreateService(name) {
    const service = new Service(name);

    return service;
};
