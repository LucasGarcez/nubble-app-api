import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'MessageController.index')
  Route.get('/:id', 'MessageController.show')
  Route.post('', 'MessageController.store')
  Route.put('/:id', 'MessageController.update')
  Route.delete('/:id', 'MessageController.destroy')
})
  .middleware(['auth:api', 'refreshToken'])
  .prefix('/messages')
