import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import { inject, injectable } from 'tsyringe'

import { IPost } from 'App/Modules/Timeline/Interfaces/IPost'
import { ITimelineCategory } from 'App/Modules/Timeline/Interfaces/ITimelineCategory'
import { ITimelineCategorySubscriber } from 'App/Modules/Timeline/Interfaces/ITimelineCategorySubscriber'
import Post from 'App/Modules/Timeline/Models/Post'
import AppException from 'App/Shared/Exceptions/AppException'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

import DTO = IPost.DTO

@injectable()
export class StorePostService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPost.Repository,
    @inject('TimelineCategoriesRepository')
    private timelineCategoriesRepository: ITimelineCategory.Repository,
    @inject('TimelineCategorySubscriptionsRepository')
    public subscriptionsRepository: ITimelineCategorySubscriber.Repository
  ) {}

  public async execute({ contents, ...postDto }: DTO.StoreWithContent): Promise<Post> {
    const { i18n, currentUser, request } = HttpContext.get()!

    if (!currentUser.allow_post)
      throw new AppException(i18n.formatMessage('messages.not_allow'), 404)

    /***
     * attach timeline category to new post if it doesn't exist timeline category id
     */
    if (!postDto.timeline_category_id) {
      const defaultTimeline = await this.timelineCategoriesRepository.findBy('is_default', true)
      if (defaultTimeline) postDto.timeline_category_id = defaultTimeline.id
    }

    /**
     * get timeline category end check if it exists
     */
    const timelineCategory = await this.timelineCategoriesRepository.findBy(
      'id',
      postDto.timeline_category_id
    )
    if (!timelineCategory)
      throw new NotFoundException(
        i18n.formatMessage('messages.not_found', {
          model: i18n.formatMessage('models.timeline_category'),
        })
      )

    /**
     * get subscribers of timeline category and check if exists
     */
    let subscription = await this.subscriptionsRepository.getSubscriber(
      currentUser.id,
      timelineCategory.id
    )
    if (!subscription)
      if (timelineCategory.is_default) {
        subscription = await this.subscriptionsRepository.store({
          allow_post: true,
          user_id: currentUser.id,
          timeline_category_id: timelineCategory.id,
          active_notification: true,
          hub_event_id: Number(request.header('hub-event-id')) || null,
        })
      } else
        throw new NotFoundException(
          i18n.formatMessage('messages.not_found', {
            model: i18n.formatMessage('models.subscription'),
          })
        )

    if ((!timelineCategory.allow_post || !subscription.allow_post) && !timelineCategory.is_default)
      throw new NotFoundException(i18n.formatMessage('messages.not_allow'))

    const post = await this.postsRepository.store({
      text: postDto.text,
      user_id: currentUser.id,
      timeline_category_id: timelineCategory.id,
    })

    if (contents && contents.length > 0) {
      const contentsDto = contents.map((content, index) => {
        return { ...content, user_id: currentUser.id, order: index }
      })

      await this.postsRepository.createManyContents(contentsDto, post)
    } else if (contents && contents.length === 0) {
      await post
        .related('contents')
        .query()
        .update({ is_deleted: true, deleted_at: DateTime.now() })
    }

    const newPost = (await this.postsRepository.findBy('id', post.id, {
      scopes: (scopes) => {
        scopes.loadContents()
        scopes.loadUser()
        scopes.reactionCount()
        scopes.messageCount()
        scopes.loadAlreadyReact(post.user_id)
      },
    }))!

    return newPost.refresh()
  }
}
