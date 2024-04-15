import Route from '@ioc:Adonis/Core/Route'

/** Private  routes */
Route.group(() => {
  /**
   *  Post  - Routes
   */
  Route.get('post', 'PostsController.index').as('post.user.list')
  Route.get('post/:id', 'PostsController.get').as('post.user.get')
  Route.post('post', 'PostsController.store').as('post.user.store')
  Route.put('post/:id', 'PostsController.edit').as('post.user.save')
  Route.delete('post/:id', 'PostsController.delete').as('post.user.delete')

  /**
   *  Post Reaction - Routes
   */
  Route.group(() => {
      Route.get('/', 'PostReactionController.index')
      Route.get('/my-reactions', 'PostReactionController.myReactions')
      Route.post('/:postId/:emojiType', 'PostReactionController.storeUpdate')
      Route.delete('/:postId/:emojiType', 'PostReactionController.destroy')
    })
      .prefix('/reactions')

  /**
   *  Post Comment - Routes
   */
  Route.post('post_comment', 'PostCommentController.store')
  Route.get('post_comment', 'PostCommentController.index')
  Route.delete('post_comment/:commentId', 'PostCommentController.destroy')
  Route.put('post_comment/:commentId', 'PostCommentController.update')
  Route.get('post_comment/:commentId', 'PostCommentController.show')
})
  .prefix('user')
  .middleware(['auth'])
