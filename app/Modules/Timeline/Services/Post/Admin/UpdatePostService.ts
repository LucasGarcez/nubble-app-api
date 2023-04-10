import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { isAfter } from 'date-fns'
import { DateTime } from 'luxon'
import { container, inject, injectable } from 'tsyringe'

import { IPost } from 'App/Modules/Timeline/Interfaces/IPost'
import { IPostContent } from 'App/Modules/Timeline/Interfaces/IPostContent'
import Post from 'App/Modules/Timeline/Models/Post'
import {
  DestroyUnpinPostJobService,
  AddUnpinPostJobService,
} from 'App/Modules/Timeline/Services/Job'
import {
  SendPostNotificationService,
  RemoveSchedulePostJobService,
  AddSchedulePostJobService,
} from 'App/Modules/Timeline/Services/Post/Admin'
import { UpdateManyPostService } from 'App/Modules/Timeline/Services/PostContent/Shared'
import AppException from 'App/Shared/Exceptions/AppException'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

import DTO = IPost.DTO

@injectable()
export class UpdatePostService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPost.Repository,
    @inject('PostContentRepository') private postContentRepository: IPostContent.Repository
  ) {}

  public async execute(
    postId: number,
    { contents, partner_ids, ...postDto }: DTO.UpdateWithContent
  ): Promise<Post | null> {
    const { i18n, currentUser } = HttpContext.get()!

    const post = await this.postsRepository.findBy('id', postId)
    if (!post)
      throw new NotFoundException(
        i18n.formatMessage('messages.not_found', {
          model: i18n.formatMessage('models.post'),
        })
      )

    if (postDto.schedule_date && postDto.is_activated)
      throw new AppException(i18n.formatMessage('messages.cannot_schedule_an_activated_post'))

    /**
     * update post if exists contents
     */
    if (contents && contents.length > 0) {
      const contentsDto = contents.map((content, index) => {
        return { ...content, user_id: post.user_id, post_id: post.id, order: index }
      })

      const existingContents = contentsDto.filter((content) => content.id)
      if (existingContents.length > 0)
        await container.resolve(UpdateManyPostService).run(existingContents)

      const newContents = contentsDto.filter((content) => !content.id)
      if (newContents.length > 0) await this.postsRepository.createManyContents(newContents, post)

      await post.load('contents')
      const notDeleteIds = post.contents.map((content) => content.id)
      if (notDeleteIds.length > 0)
        await this.postContentRepository.deleteFromPost(post.id, notDeleteIds)
    } else if (contents && contents.length === 0) {
      await post
        .related('contents')
        .query()
        .update({ is_deleted: true, deleted_at: DateTime.now() })
    }

    /**
     * merge and save post
     */
    post.merge(postDto)
    await this.postsRepository.save(post)

    /**
     * sync partners
     */
    if (partner_ids && partner_ids.length > 0) await post.related('partners').sync(partner_ids)

    /**
     * if enable send post send notification
     */
    if (post.send_notification) await new SendPostNotificationService().run(post)

    /**
     * if enable remove and create a new job
     */
    if (post.schedule_date) {
      if (isAfter(post.schedule_date.toJSDate(), new Date())) {
        await new RemoveSchedulePostJobService().run(post.id)
        await new AddSchedulePostJobService().run(post)
      }
    }

    if (post.is_fixed && post.fixed_date) {
      if (isAfter(post.fixed_date.toJSDate(), new Date())) {
        await container.resolve(DestroyUnpinPostJobService).run(post.id)
        await container
          .resolve(AddUnpinPostJobService)
          .run({ fixationDeadline: post.fixed_date, postId: post.id })
      }
    }

    return this.postsRepository.findBy('id', post.id, {
      scopes: (scopes) => {
        if (currentUser.admin) scopes.loadUserForAdmin()
        else scopes.loadUser()
        scopes.loadContents()
        scopes.reactionCount()
        scopes.messageCount()
        scopes.loadPartners()
        scopes.loadAlreadyReact(post.user_id)
      },
    })
  }
}
