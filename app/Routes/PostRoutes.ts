import Route from '@ioc:Adonis/Core/Route'

/** Private  routes */
Route.group(() => {
  /**
   *  Posts - Routes
   */
  Route.group(() => {
    Route.get('/', 'PostsController.index').as('post.user.index')
    Route.get('/:id', 'PostsController.show').as('post.user.show')
    Route.post('/', 'PostsController.store').as('post.user.store')
    Route.put('/:id', 'PostsController.update').as('post.user.update')
    Route.delete('/:id', 'PostsController.destroy').as('post.user.destroy')
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
      Route.get('/', 'PostReactionController.index')
      Route.post('/', 'PostReactionController.store')
      Route.put('/', 'PostReactionController.update')
      Route.delete('/x:postId', 'PostReactionController.destroy')
    })
      .prefix('/reactions')

    /**
     *  Post Comment - Routes
     */
    Route.group(() => {
      Route.get('/', 'PostCommentController.index')
      Route.get('/:commentId', 'PostCommentController.show')
      Route.post('/', 'PostCommentController.store')
      Route.put('/:commentId', 'PostCommentController.update')
      Route.delete('/:commentId', 'PostCommentController.destroy')
    })
      .prefix('/comments')
  })
    .prefix('/post')

})
  .middleware(['auth'])
