import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/', 'PostsController.get').as('users.store')
  Route.get('/', 'PostsController.list').as('users.list')
  Route.get('/:id', 'PostsController.get').as('users.get')
  Route.put('/:id', 'PostsController.edit').as('users.edit')
  Route.delete('/:id', 'PostsController.delete').as('users.delete')
})
  .middleware(['auth:api', 'refreshToken'])
  .prefix('/post')
