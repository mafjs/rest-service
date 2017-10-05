# @maf/rest-service 0.x

## architecture

based on express, joi and maf-rest


### create instance

```js
const service = require('@maf/rest-service')('myservice');
```

- create logger
- create default config (maf-config instance)
- init global error handlers (uncaughtException, unhandledRejection)
- create maf-rest instance (simple http methods with joi request validation, request and response helpers)


### init

```js
service.init();
```

- create express app
- create morgan access logger
- disable express x-powered-by headers, etag
- add express CORS
- express.set 'trust proxy'


### start

```js
service.start()
    .then()
    .catch();
```
- start express server
- listen process signals SIGINT, SIGTERM for fast graceful reloads (close connections, stop server and db connections)
