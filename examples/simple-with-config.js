const service = require('../')('myservice', {
    port: 4000,
    logger: {
        level: 'trace',
        src: false
    },
    accessLog: {
        path: `${__dirname}`
    }
});

service.addMethods({
    'GET /todos': (req, res) => {
        req.logger.debug(`req.id = ${req.ctx.id}`);

        res.result([1, 2, 3]);
    }
});

service.init();

service.start();


// node examples/simple-with-config.js | bunyan -o short -L
// curl -v http://localhost:4000/todos
