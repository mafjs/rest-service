require('source-map-support').install();

require('maf-error/initGlobal');

var Service = require('./Service');

module.exports = function (name) {
    var service = new Service(name);

    return service;
};
