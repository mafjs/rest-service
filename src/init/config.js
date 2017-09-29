const Config = require('maf-config');

module.exports = function restServiceInitConfig(rawConfig) {
    const config = new Config();

    const env = process.env;

    const host = env.HOST || null;
    const port = env.PORT || 3000;
    const publicBaseUrl = env.CONFIG_PUBLIC_BASE_URL || `http://localhost:${port}`;

    config.setRaw('.', {
        autoInit: true,
        logLevel: null,
        host,
        port,
        publicBaseUrl,
        cors: {
            origin: '*',
            preflightContinue: true,
            methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
        },
        accessLog: {
            format: [
                ':remote-addr',
                ':remote-user',
                '[:date[clf]]',
                ':method',
                ':url',
                'HTTP/:http-version',
                ':status',
                ':res[content-length]',
                ':response-time',
                ':referrer',
                ':user-agent'
            ],
            filename: 'access.log',
            path: '/var/log/app',
            rotateInterval: '1d'
        }
    });

    if (typeof rawConfig !== 'undefined') {
        config.mergeRaw(rawConfig);
    }

    return config;
};
