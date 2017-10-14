const http = require('http');
const joi = require('maf-rest/joi');

const init = {
    logger: require('./init/logger'),
    config: require('./init/config'),
    globalErrorHandlers: require('./init/globalErrorHandlers'),
    server: require('./init/server'),
    processSignals: require('./init/processSignals'),
    rest: require('./init/rest')
};

/**
 * Rest Service class
 */
class RestService {
    /**
     * - create config merged with rawConfig if exists
     * - create logger (maf-logger instance based on bunyan)
     * - init global error handlers (uncaughtException, unhandledRejection)
     *
     * @param {String} name        service name
     * @param {?Object} rawConfig  raw config, merge with default config
     */
    constructor(name, rawConfig) {
        this._config = init.config(rawConfig);

        this._name = `${this._config.get('mode')}-${name}`;

        this._config.set('name', this._name);

        this.joi = joi;

        const loggerConfig = (rawConfig && rawConfig.logger)
            ? rawConfig.logger
            : {};

        this._logger = init.logger(this._name, loggerConfig);

        init.globalErrorHandlers(this._logger);

        this._di = {};

        this._appInited = false;
        this._restInited = false;
        this._restMethodsInited = false;

        this._app = null;
        this._server = null;
        this._serverInited = false;

        this._rest = null;
        this._restEndpoint = null;
        this._restMethods = [];
    }

    /**
     * express instance
     * @return {Express}
     */
    get app() {
        return this._app;
    }

    /**
     * http server instance
     * @return {HttpServer}
     */
    get server() {
        return this._server;
    }

    /**
     * maf-config instance
     * @see https://github.com/mafjs/config#maf-config
     * @return {Config}
     */
    get config() {
        return this._config;
    }

    /**
     * Dependency Injection object
     * pure JS object with apis, models, config, etc ...
     *
     * @return {Object}
     */
    get di() {
        return this._di;
    }

    /**
     * setter for Dependency Injection object
     *
     * @param {Object} di
     */
    set di(di) {
        this._di = di;
    }

    /**
     * maf logger instance based on bunyan
     *
     * @see https://github.com/mafjs/logger#maf-logger
     * @return {Logger}
     */
    get logger() {
        return this._logger;
    }

    /**
     * Service name
     *
     * @return {String}
     */
    get name() {
        return this._name;
    }

    /**
     * maf-rest object
     *
     * @see https://github.com/mafjs/rest#maf-rest
     * @return {Rest}
     */
    get rest() {
        return this._rest;
    }

    /**
     * add REST methods
     *
     * @param {Object} methods
     */
    addMethods(methods) {
        this._restMethods.push(methods);
    }

    /**
     * set endpoint for all methods
     *
     * @example service.setEndpoint('/api/v1');
     * @param {String} endpoint
     */
    setEndpoint(endpoint) {
        this._restEndpoint = endpoint;
    }

    /**
     * init service
     *
     * - create express application
     */
    init() {
        this._initApp();
        this._initRest();
    }

    /**
     * - create maf-rest instance
     * - init rest methods
     *
     * @private
     * @return {[type]}
     */
    initRestMethods() {
        if (this._restMethodsInited) {
            return Promise.resolve();
        }

        const promises = [];

        Object.keys(this._restMethods).forEach((key) => {
            const methods = this._restMethods[key];
            promises.push(this._rest.addMethods(methods));
        });

        this._restMethodsInited = true;

        return Promise.all(promises)
            .then(() => this._initRest())
            .then(() => this._rest.initMethods(this._app, this._di));
    }

    /**
     * init http server
     * @return {Promise}
     */
    initServer() {
        return new Promise((resolve, reject) => {
            if (this._serverInited) {
                return resolve();
            }

            this.init();

            this.initRestMethods()
                .then(() => {
                    this._server = http.createServer(this._app);
                    this._serverInited = true;
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /**
     * - init express app, if not inited before
     * - init rest instance, if not inited before
     * - start express server
     *
     * @return {Promise}
     */
    start() {
        return new Promise((resolve /* , reject */) => {
            this.initServer()
                .then(() => {
                    this._listen();
                    resolve();
                })
                .catch((error) => {
                    this._logger.error(error);
                    process.exit(255);
                });
        });
    }

    /**
     * - create express application
     * @private
     */
    _initApp() {
        if (this._appInited) {
            return;
        }

        this._app = init.server(this._logger, this._config, this._di);

        this._appInited = true;
    }

    /**
     * @private
     * @return {Boolean}
     */
    _initRest() {
        if (this._restInited) {
            return true;
        }

        this._rest = init.rest(this._logger, this._config);
        this._rest.initApp(this._app, this._di);

        if (this._restEndpoint) {
            this._rest.setEndpoint(this._restEndpoint);
        }

        this._restInited = true;

        return true;
    }

    /**
     * - start express server
     * - init listeners for process signals SIGTERM, SIGINT
     *
     * @private
     */
    _listen() {
        const host = this._config.get('host');
        const port = this._config.get('port');

        this._server.listen(port, host, () => {
            this._logger.info(`listen on ${host}:${port}`);
        });

        init.processSignals(this._logger, this._server);
    }
}

module.exports = RestService;
