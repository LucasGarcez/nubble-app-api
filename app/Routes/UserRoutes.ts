import Route from '@ioc:Adonis/Core/Route'

/** Private  Routes */
Route.group(() => {
  /** Users - Routes */
  Route.get('/', 'UsersController.list')
  Route.get('/:id', 'UsersController.get').as('users.get')
  Route.put('/:id', 'UsersController.edit').as('users.edit')
  Route.delete('/:id', 'UsersController.delete').as('users.delete')
})
.prefix('/users')
.middleware(['auth:api', 'refreshToken'])

Route.group(() => {
  /** Profile - Routes */
  Route.post('/edit-password', 'AuthController.editPassword').as('auth.editPassword')
  Route.get('/logout', 'AuthController.logout').as('auth.logout')
})
.prefix('/profile')
.middleware('auth:api')

/** Public Routes */
Route.group(() => {
  /** Login - Routes */
  Route.post('/register', 'AuthController.register').as('auth.register')
  Route.post('/login', 'AuthController.login').as('auth.login')
  Route.post('/forgot-password', 'AuthController.forgotPassword').as('auth.forgotPassword')
  Route.get('/reset-password/:tempToken/:email', 'AuthController.resetPassword').as('auth.resetPassword')
  Route.post('/refresh-token', 'AuthController.refreshToken').as('auth.refreshToken')
})
