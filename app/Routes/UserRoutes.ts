import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/users/', 'UsersController.list')
  Route.get('/users/:id', 'UsersController.get').as('users.get')
  Route.put('/users/:id', 'UsersController.edit').as('users.edit')
  Route.delete('/users/:id', 'UsersController.delete').as('users.delete')
}).middleware(['auth:api', 'refreshToken'])

/** public routes */
Route.group(() => {
  Route.post('/register', 'AuthController.register').as('auth.register')
  Route.post('/login', 'AuthController.login').as('auth.login')
})

Route.post('/refresh-token', 'AuthController.refreshToken')
// TODO: DOCUMENTATION OF THE REFRESH TOKEN ROUTE