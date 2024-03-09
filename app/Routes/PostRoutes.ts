import Route from '@ioc:Adonis/Core/Route'

/** Private  routes */
Route.group(() => {
  /**
   *  Posts - Routes
   */
  Route.group(() => {
    Route.get('/', 'PostsController.list').as('post.user.list')
    Route.get('/:id', 'PostsController.get').as('post.user.get')
    Route.post('/', 'PostsController.store').as('post.user.store')
    Route.put('/:id', 'PostsController.edit').as('post.user.save')
    Route.delete('/:id', 'PostsController.delete').as('post.user.delete')
  })
    .prefix('/posts')

  /**
   *  Post - Routes
   */
  Route.group(() => {
    /**
     *  Post Reaction - Routes
     */
    Route.group(() => {
      Route.post('/', 'PostReactionController.store')
      Route.delete('/x:postId', 'PostReactionController.destroy')
      Route.put('/', 'PostReactionController.update')
      Route.get('/', 'PostReactionController.index')
    })
      .prefix('/reactions')

    /**
     *  Post Comment - Routes
     */
    Route.group(() => {
      Route.post('/', 'PostCommentController.store')
      Route.get('/', 'PostCommentController.index')
      Route.delete('/:commentId', 'PostCommentController.destroy')
      Route.put('/:commentId', 'PostCommentController.update')
      Route.get('/:commentId', 'PostCommentController.show')
    })
      .prefix('/comments')
  })
    .prefix('/post')

})
  .middleware(['auth'])
