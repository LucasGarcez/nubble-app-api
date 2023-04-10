import Route from '@ioc:Adonis/Core/Route'

import PostCommentController from 'App/Modules/Timeline/Controllers/Http/User/PostCommentController'
import PostCommentReactionController from 'App/Modules/Timeline/Controllers/Http/User/PostCommentReactionController'
import PostController from 'App/Modules/Timeline/Controllers/Http/User/PostController'
import PostReactionController from 'App/Modules/Timeline/Controllers/Http/User/PostReactionController'
import TimelineCategoryController from 'App/Modules/Timeline/Controllers/Http/User/TimelineCategoryController'
import TimelineCategoryReactionController from 'App/Modules/Timeline/Controllers/Http/User/TimelineCategoryReactionController'
import TimelineCategorySubscriberController from 'App/Modules/Timeline/Controllers/Http/User/TimelineCategorySubscriberController'
import MiddlewareTypes from 'App/Shared/Types/MiddlewareTypes'

/** public  routes */
Route.group(() => {}).prefix('user')

/** Private  routes */
Route.group(() => {
  /**
   *  Post  - Routes
   */
  Route.get('post', new PostController().index).as('post.user.list')
  Route.get('post/:id', new PostController().show).as('post.user.get')
  Route.post('post', new PostController().store).as('post.user.store')
  Route.put('post/:id', new PostController().update).as('post.user.save')
  Route.delete('post/:id', new PostController().destroy).as('post.user.delete')

  /**
   *  Post Reaction - Routes
   */
  Route.post('post_reaction', new PostReactionController().store)
  Route.delete('post_reaction/:postId', new PostReactionController().destroy)
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

  /**
   *  Post Comment Reactions - Routes
   */
  Route.post('post_comment_reaction', new PostCommentReactionController().store)
  Route.get('post_comment_reaction', new PostCommentReactionController().index)
  Route.delete('post_comment_reaction/:commentId', new PostCommentReactionController().destroy)
  Route.put('post_comment_reaction', new PostCommentReactionController().update)

  /**
   * Timeline Category Subscriber - Routes
   */

  Route.post('timeline_category/subscribe', new TimelineCategorySubscriberController().store)
  Route.delete(
    'timeline_category/subscribe/:timelineCategoryId',
    new TimelineCategorySubscriberController().destroy
  )
  Route.put(
    'timeline_category/:timelineCategoryId/subscribe',
    new TimelineCategorySubscriberController().update
  )

  /**
   * Timeline Category Subscriber - Routes
   */

  Route.post('timeline_category/reaction', new TimelineCategoryReactionController().store)
  Route.delete(
    'timeline_category/reaction/:timelineCategoryId',
    new TimelineCategoryReactionController().destroy
  )

  /**
   * Timeline Category - Routes
   */

  Route.get('timeline_category', new TimelineCategoryController().index)
  Route.get('timeline_category/:id', new TimelineCategoryController().show)
  Route.get('timeline_category/:id/members', new TimelineCategoryController().indexMembers)
})
  .prefix('user')
  .middleware(MiddlewareTypes.user)
