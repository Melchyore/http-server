<div align="center">
  <img src="https://res.cloudinary.com/adonisjs/image/upload/q_100/v1557762307/poppinss_iftxlt.jpg" width="600px">
</div>

# Http Server
[![circleci-image]][circleci-url] [![npm-image]][npm-url] ![](https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript)

Node.js HTTP server with a slick router used by AdonisJs. Think of it as an ExpressJs style server written in Typescript.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of contents

- [Usage](#usage)
- [MiddlewareStore](#middlewarestore)
- [Router](#router)
- [API](#api)
- [Change log](#change-log)
- [Contributing](#contributing)
- [Authors & License](#authors--license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage
Install the package from npm registry as follows:

```sh
npm i @poppinss/http-server

# yarn
yarn add @poppinss/http-server
```

and then use it as follows:

```ts
import { createServer } from 'http'
import { getLogger } from '@poppinss/logger'
import {
  Server,
  Router,
  MiddlewareStore,
  routePreProcessor,
  HttpContext,
} from '@poppinss/http-server'

// more on middleware later
const middleware = new MiddlewareStore()
const router = new Router((route) => {
  routePreProcessor(route, middleware)
})
router.get('/', async () => 'hello world')

const server = new Server(HttpContext, router, middlewareStore, getLogger(), config)
router.commit()
server.optimize()

createServer(server.handle.bind(server)).listen(3000)
```

Wow! too much boilerplate. That's why we recommend using AdonisJs over wiring up things by hand.

## MiddlewareStore
The middleware store is used to store global and named middleware. The global middleware runs on all HTTP requests and named one can be attached to a given route.

```ts
const middleware = new MiddlewareStore()

// Global middleware
middleware.register([
  async function () {},
  async function () {},
])

// Named middleware
middleware.registerNamed({
  auth: async function () {}
})
```

The named middleware can be referenced on the route as follows:

```ts
router.get('/', async function () {
}).middleware(['auth'])
```

## Router
AdonisJs has one of the most advanced and fast router. It has support for `Route groups`, `Resourceful resources` and many more.

```ts
router.group(() => {
  router.get('/', async () => {
  })
}).prefix('v1')
```

We recommend you to check the API docs to get a complete reference of all the classes.

## API
Following are the autogenerated files via Typedoc

* [API](docs/README.md)

## Change log

The change log can be found in the [CHANGELOG.md](CHANGELOG.md) file.

## Contributing

Everyone is welcome to contribute. Please go through the following guides, before getting started.

1. [Contributing](https://adonisjs.com/contributing)
2. [Code of conduct](https://adonisjs.com/code-of-conduct)


## Authors & License
[Harminder virk](https://github.com/Harminder virk) and [contributors](https://github.com/poppinss/http-server/graphs/contributors).

MIT License, see the included [MIT](LICENSE.md) file.

[circleci-image]: https://img.shields.io/circleci/project/github/poppinss/http-server/master.svg?style=for-the-badge&logo=circleci
[circleci-url]: https://circleci.com/gh/poppinss/http-server "circleci"

[npm-image]: https://img.shields.io/npm/v/@poppinss/http-server.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/@poppinss/http-server "npm"
