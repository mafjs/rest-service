# @maf/rest-service

[![npm version](https://badge.fury.io/js/%40maf%2Frest-service.svg)](https://badge.fury.io/js/%40maf%2Frest-service)

## install

```
npm i --save @maf/rest-service@latest
# OR
yarn add @maf/rest-service@latest
```

## usage


### simple

```js
require('@maf/rest-service')('simple-service', {port: 4000})
    .setEndpoint('/api/v1')
    .addMethods({
        'GET /todos': (req, res) => {
            req.logger.debug(`req.id = ${req.ctx.id}`);

            res.result([1, 2, 3]);
        }
    })
    .start();

// curl -v http://localhost:4000/api/v1/todos
```

### with request validation

```js
const service = require('@maf/rest-service')('myservice');

service.setEndpoint('/api/v1');

const joi = service.joi;

service.addMethods({
    'GET /todos': {
        schema: {
            query: joi.object().keys({
                limit: joi.number().integer().min(1).max(5).default(5)
            })
        },

        handler: (req, res) => {
            const todos = [1, 2, 3, 4, 5];
            res.result(todos.slice(0, req.query.limit));
        }
    }
});

service.start();

// curl -v http://localhost:3000/api/v1/todos
// curl -v http://localhost:3000/api/v1/todos?limit=3
// curl -v http://localhost:3000/api/v1/todos?limit=10
```

### todos REST API example

see [examples/todos-rest-api](https://github.com/mafjs/rest-service/blob/master/examples/todos-rest-api/index.js)

<!-- more examples => https://github.com/mafjs/rest-service-example -->
