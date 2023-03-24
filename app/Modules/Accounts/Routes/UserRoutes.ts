import Route from '@ioc:Adonis/Core/Route'

import UsersController from 'App/Modules/Accounts/Controllers/Http/User/UsersController'
import AuthController from 'App/Modules/Accounts/Controllers/Http/User/AuthController'

Route.group(() => {
  Route.get('/', new UsersController().list).as('users.list')
  Route.get('/:id', new UsersController().get).as('users.get')
  Route.put('/:id', new UsersController().edit).as('users.edit')
  Route.delete('/:id', new UsersController().delete).as('users.delete')
})
  .prefix('users')
  .middleware(['auth', 'acl:root,Admin,user,guest'])

/** public routes */
Route.group(() => {
  Route.post('/register', new AuthController().register).as('auth.register')
  Route.post('/login', new AuthController().login).as('auth.login')
})
