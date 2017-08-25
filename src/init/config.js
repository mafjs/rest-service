var Config = require('maf-config');

module.exports = function () {
    var config = new Config();

    var env = process.env;

    var host = env.CONFIG_HOST || null;
    var port = env.CONFIG_PORT || 3000;
    var publicBaseUrl = env.PUBLIC_BASE_URL || `http://localhost:${port}`;

    config.setRaw('.', {
        host: host,
        port: port,
        publicBaseUrl: publicBaseUrl,
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

    return config;
};
