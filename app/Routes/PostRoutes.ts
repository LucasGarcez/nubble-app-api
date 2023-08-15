import Route from '@ioc:Adonis/Core/Route'

import PostCommentController from 'App/Controllers/Http/PostCommentController'
import PostController from 'App/Controllers/Http/PostsController'
import PostReactionController from 'App/Controllers/Http/PostReactionController'

/** Private  routes */
Route.group(() => {
  /**
   *  Post  - Routes
   */
  Route.get('post', new PostController().list).as('post.user.list')
  Route.get('post/:id', new PostController().get).as('post.user.get')
  Route.post('post', new PostController().store).as('post.user.store')
  Route.put('post/:id', new PostController().edit).as('post.user.save')
  Route.delete('post/:id', new PostController().delete).as('post.user.delete')

  /**
   *  Post Reaction - Routes
   */
  Route.post('post_reaction', new PostReactionController().store)
  Route.delete('post_reaction/x:postId', new PostReactionController().destroy)
  Route.put('post_reaction', new PostReactionController().update)
  Route.get('post_reaction', new PostReactionController().index)

  /**
   *  Post Comment - Routes
   */
  Route.post('post_comment', new PostCommentController().store)
  Route.get('post_comment', new PostCommentController().index)
  Route.delete('post_comment/:commentId', new PostCommentController().destroy)
  Route.put('post_comment/:commentId', new PostCommentController().update)
  Route.get('post_comment/:commentId', new PostCommentController().show)
})
  .prefix('user')
  .middleware(['auth:api', 'refreshToken'])
