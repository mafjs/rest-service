# @maf/rest-service

stability: unstable


## install

```
npm i --save @maf/rest-service@latest
# RO
yarn add @maf/rest-service@latest
```

## usage

```js
var service = require('@maf/rest-service')('myservice');

var joi = service.joi;

service.addMethods({
    'GET /': {

        handler: function (req, res, next) {
            res.result(['here', 'we', 'are']);
        }
    },
    'POST /': {
        schema: {
            body: joi.object().required().keys({
                name: joi.string().required()
            })
        },

        handler: function (req, res) {
            var item = req.body;
            res.result(item);
        }
    }
});

service.listen();

```

more examples => https://github.com/mafjs/rest-service-example
