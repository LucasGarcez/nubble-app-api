import Route from '@ioc:Adonis/Core/Route'

import PerformancesController from 'App/Modules/Timeline/Controllers/Http/Admin/PerformancesController'
import PostsController from 'App/Modules/Timeline/Controllers/Http/Admin/PostsController'
import TimelineCategoriesController from 'App/Modules/Timeline/Controllers/Http/Admin/TimelineCategoriesController'
import MiddlewareTypes from 'App/Shared/Types/MiddlewareTypes'

Route.group(() => {
  /**
   *  Timeline Categories  - Routes
   */
  Route.get('timeline_category', new TimelineCategoriesController().list).as(
    'timeline_category.list'
  )
  Route.get('timeline_category/:id', new TimelineCategoriesController().show).as(
    'timeline_category.admin.show'
  )
  Route.post('timeline_category', new TimelineCategoriesController().store).as(
    'timeline_category.admin.store'
  )
  Route.put('timeline_category/:id', new TimelineCategoriesController().update).as(
    'timeline_category.admin.update'
  )
  Route.delete('timeline_category/:id', new TimelineCategoriesController().destroy).as(
    'timeline_category.admin.destroy'
  )
  Route.get('timeline_category/:id/members', new TimelineCategoriesController().listMembers).as(
    'timeline_category.admin.list_members'
  )

  /**
   *  Post  - Routes
   */
  Route.get('post', new PostsController().list).as('post.admin.list')
  Route.get('post/:id', new PostsController().show).as('post.admin.show')
  Route.post('post', new PostsController().store).as('post.admin.store')
  Route.put('post/:id', new PostsController().update).as('post.admin.update')
  Route.delete('post/:id', new PostsController().delete).as('post.admin.delete')
  Route.patch('post/:id', new PostsController().activeOrDisable).as('post.admin.enableOrDisable')
  Route.post('post/:id/notification/send', new PostsController().sendNotification).as(
    'post.admin.send-notification'
  )

  /**
   *  Performance  - Routes
   */
  Route.get(
    'timeline_category/:id/user/performance',
    new PerformancesController().chartUserTimeline
  ).as('timeline_category.user.performance')
  Route.get(
    'timeline_category/:id/post/performance',
    new PerformancesController().chartPostTimeline
  ).as('timeline_category.post.performance')
  Route.get(
    'timeline_category/:id/post/more_interacted',
    new PerformancesController().listMoreInteractedPost
  ).as('timeline_category.post.more_interacted')
})
  .prefix('admin')
  .middleware(MiddlewareTypes.admin)
