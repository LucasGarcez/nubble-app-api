import Route from '@ioc:Adonis/Core/Route'

/** Private  Routes */
Route.group(() => {
  /** Message - Routes */
  Route.get('/', 'MessageController.index')
  Route.get('/:id', 'MessageController.show')
  Route.post('/', 'MessageController.store')
  Route.put('/:id', 'MessageController.update')
  Route.delete('/:id', 'MessageController.destroy')
})
  .prefix('/messages')
  .middleware(['auth'])
