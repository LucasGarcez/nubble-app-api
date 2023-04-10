import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { container, inject, injectable } from 'tsyringe'

import { IUserPoint } from 'App/Modules/Gamification/Interfaces/IUserPoint'
import { AddPointUserService } from 'App/Modules/Gamification/Services/UserPoint/AddPointUserService'
import { IAutomatedLead } from 'App/Modules/Lead/Interfaces/IAutomatedLead'
import { ILeadCategory } from 'App/Modules/Lead/Interfaces/ILeadCategory'
import { StoreAutomatedLeadService } from 'App/Modules/Lead/Services/AutomatedLead'
import { IPost } from 'App/Modules/Timeline/Interfaces/IPost'
import { IPostComment } from 'App/Modules/Timeline/Interfaces/IPostComment'
import PostComment from 'App/Modules/Timeline/Models/PostComment'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

import { SendPostCommentNotificationService } from './SendPostCommentNotificationService'

@injectable()
export class CreatePostCommentService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPost.Repository,
    @inject('PostCommentRepository')
    private postCommentRepository: IPostComment.Repository,
    @inject('LeadCategoriesRepository') private leadCategoriesRepository: ILeadCategory.Repository,
    @inject('AutomatedLeadsRepository') private automatedLeadsRepository: IAutomatedLead.Repository
  ) {}

  public async run(commentDto: IPostComment.DTO.Store): Promise<PostComment | null> {
    const ctx = HttpContext.get()!

    const post = await this.postsRepository.findBy('id', commentDto.post_id, {
      scopes: (scopes) => {
        scopes.loadPartners()
      },
    })
    if (!post)
      throw new NotFoundException(
        ctx.i18n.formatMessage('messages.not_found', {
          model: ctx.i18n.formatMessage('models.post'),
        })
      )

    const comment = await this.postCommentRepository.create(commentDto)

    if (post.partners.length) {
      const leadCategory = await this.leadCategoriesRepository.findBy(
        'type',
        ILeadCategory.Types.commentPartnerPost
      )

      if (leadCategory) {
        for (const partner of post.partners) {
          const alreadyCommentedPost = await this.automatedLeadsRepository.findBy(
            'lead_category_id',
            leadCategory.id,
            {
              clauses: {
                where: {
                  partnerId: partner.id,
                  userId: commentDto.user_id,
                },
              },
            }
          )

          if (!alreadyCommentedPost) {
            const storeAutomatedLeadService = container.resolve(StoreAutomatedLeadService)
            await storeAutomatedLeadService.run({
              leadType: ILeadCategory.Types.commentPartnerPost,
              partnerId: partner.id,
              refId: partner.id,
              userId: commentDto.user_id,
            })
          }
        }
      }
    }

    if (commentDto.user_id !== post.user_id) {
      const addUserPointService = container.resolve(AddPointUserService)
      await addUserPointService.run({
        ref_id: String(comment.id),
        master_ref_id: String(post.id),
        master_ref_table: 'posts',
        author_id: commentDto.user_id,
        type: IUserPoint.Types.commentPost,
        user_id: commentDto.user_id,
      })
      await addUserPointService.run({
        ref_id: String(comment.id),
        master_ref_id: String(post.id),
        master_ref_table: 'posts',
        author_id: post.user_id,
        type: IUserPoint.Types.commentToYourPost,
        user_id: post.user_id,
      })
    }

    await post.load('user')
    await container.resolve(SendPostCommentNotificationService).run({
      ownerId: post.user_id,
      ownerLanguageRefCode: post.user.language,
      newerCommentUser: {
        id: ctx.currentUser.id,
        name: ctx.currentUser.name,
      },
      postId: post.id,
    })

    return this.postCommentRepository.show(comment.id, commentDto.user_id)
  }
}
