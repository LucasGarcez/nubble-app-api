// start/kernel.ts

import Server from '@ioc:Adonis/Core/Server'

/*
|--------------------------------------------------------------------------
| Global middleware
|--------------------------------------------------------------------------
|
| An array of global middleware, that will be executed in the order they
| are defined for every HTTP requests.
|
*/
Server.middleware.register([() => import('@ioc:Adonis/Core/BodyParser')])

/*
|--------------------------------------------------------------------------
| Named middleware
|--------------------------------------------------------------------------
|
| Named middleware are defined as key-value pair. The value is the namespace
| or middleware function and key is the alias. Later you can use these
| alias on individual routes. For example:
|
|
*/ // start/kernel.ts

Server.middleware.registerNamed({
  auth: () => import('App/Shared/Middleware/Auth'),
  refreshToken: () => import('App/Shared/Middleware/RefreshTokenMiddleware'),
})
