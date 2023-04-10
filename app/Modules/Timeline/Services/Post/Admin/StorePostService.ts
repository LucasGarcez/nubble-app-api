import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { isAfter } from 'date-fns'
import { DateTime } from 'luxon'
import { container, inject, injectable } from 'tsyringe'

import { IPost } from 'App/Modules/Timeline/Interfaces/IPost'
import { ITimelineCategory } from 'App/Modules/Timeline/Interfaces/ITimelineCategory'
import Post from 'App/Modules/Timeline/Models/Post'
import {
  SendPostNotificationService,
  AddSchedulePostJobService,
} from 'App/Modules/Timeline/Services/Post/Admin/'
import { CreateDefaultTimelineCategoryService } from 'App/Modules/Timeline/Services/TimelineCategory/Shared'
import AppException from 'App/Shared/Exceptions/AppException'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

import { AddUnpinPostJobService } from '../../Job'

import DTO = IPost.DTO

@injectable()
export class StorePostService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPost.Repository,
    @inject('TimelineCategoriesRepository')
    private timelineCategoriesRepository: ITimelineCategory.Repository
  ) {}

  private storeDefaultTimeline = container.resolve(CreateDefaultTimelineCategoryService)

  public async execute(postDto: DTO.StoreWithContent): Promise<Post | null> {
    const { i18n, currentUser, request } = HttpContext.get()!

    if (!postDto.timeline_category_id) {
      const defaultTimeline = await this.timelineCategoriesRepository.findBy('is_default', true)
      if (defaultTimeline) postDto.timeline_category_id = defaultTimeline.id
      else {
        await this.storeDefaultTimeline.run(Number(request.header('hub-event-id')))
        const defaultTimeline = await this.timelineCategoriesRepository.findBy('is_default', true)
        if (defaultTimeline) postDto.timeline_category_id = defaultTimeline.id
      }
    }

    if (!postDto.timeline_category_id)
      throw new NotFoundException(
        i18n.formatMessage('messages.not_found', {
          model: i18n.formatMessage('models.timeline_category'),
        })
      )

    if (postDto.schedule_date && postDto.is_activated)
      throw new AppException(i18n.formatMessage('messages.cannot_schedule_an_activated_post'))

    const { contents, partner_ids, ...postData } = postDto

    /**
     * store post with contents if exists
     */
    const post = await this.postsRepository.store({
      ...postData,
      order_date: postDto.fixed_date ? postDto.fixed_date : DateTime.now(),
      user_id: currentUser.id,
      timeline_category_id: postDto.timeline_category_id,
    })

    /**
     * store contents
     */
    if (contents && contents.length > 0) {
      const contentsDto = contents.map((content, index) => {
        return { ...content, user_id: currentUser.id, order: index }
      })
      await this.postsRepository.createManyContents(contentsDto, post)
    }

    /**
     * attach partners
     */
    if (partner_ids && partner_ids.length > 0) await post.related('partners').attach(partner_ids)

    /**
     * if enable send post send notification
     */
    if (post.send_notification) await new SendPostNotificationService().run(post)

    /**
     * if enable create a new job
     */
    if (post.schedule_date && isAfter(post.schedule_date.toJSDate(), new Date()))
      await new AddSchedulePostJobService().run(post)

    if (post.is_fixed && post.fixed_date && isAfter(post.fixed_date.toJSDate(), new Date()))
      await container
        .resolve(AddUnpinPostJobService)
        .run({ fixationDeadline: post.fixed_date, postId: post.id })

    return this.postsRepository.findBy('id', post.id, {
      scopes: (scopes) => {
        scopes.loadContents()
        scopes.loadUserForAdmin()
        scopes.reactionCount()
        scopes.messageCount()
        scopes.loadPartners()
        scopes.loadAlreadyReact(post.user_id)
      },
    })
  }
}
