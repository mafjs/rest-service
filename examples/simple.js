let service = require('../')('simple-service', {port: 4000, logger: {level: 'debug'}});
service
    .setEndpoint('/api/v1')
    .addMethods({
        'GET /todos': (req, res) => {
            req.logger.debug(`req.id = ${req.ctx.id}`);

            res.result([1, 2, 3]);
        }
    })
    .start()
    .then(() => {
        // setTimeout(() => {
        //     service.exit(new Error('test'));
        // }, 1000);

    });

// node examples/simple.js | bunyan -o short -L
// curl -v http://localhost:4000/api/v1/todos
