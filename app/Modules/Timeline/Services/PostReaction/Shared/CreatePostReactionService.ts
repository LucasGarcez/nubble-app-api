import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { container, inject, injectable } from 'tsyringe'

import { IUserPoint } from 'App/Modules/Gamification/Interfaces/IUserPoint'
import { AddPointUserService } from 'App/Modules/Gamification/Services/UserPoint/AddPointUserService'
import { IAutomatedLead } from 'App/Modules/Lead/Interfaces/IAutomatedLead'
import { ILeadCategory } from 'App/Modules/Lead/Interfaces/ILeadCategory'
import { StoreAutomatedLeadService } from 'App/Modules/Lead/Services/AutomatedLead'
import { IPost } from 'App/Modules/Timeline/Interfaces/IPost'
import { IPostReaction } from 'App/Modules/Timeline/Interfaces/IPostReaction'
import PostReaction from 'App/Modules/Timeline/Models/PostReaction'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

import { SendPostReactionNotificationService } from './SendPostReactionNotificationService'

@injectable()
export class CreatePostReactionService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPost.Repository,
    @inject('PostReactionRepository')
    private postReactionRepository: IPostReaction.Repository,
    @inject('LeadCategoriesRepository') private leadCategoriesRepository: ILeadCategory.Repository,
    @inject('AutomatedLeadsRepository') private automatedLeadsRepository: IAutomatedLead.Repository
  ) {}

  public async run(reactionDto: IPostReaction.DTO.Store): Promise<PostReaction> {
    const ctx = HttpContext.get()!

    const post = await this.postsRepository.findBy('id', reactionDto.post_id, {
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

    const reaction = await this.postReactionRepository.create(reactionDto)

    if (post.partners.length) {
      const leadCategory = await this.leadCategoriesRepository.findBy(
        'type',
        ILeadCategory.Types.reactPartnerPost
      )

      if (leadCategory) {
        for (const partner of post.partners) {
          const alreadyReactedToPost = await this.automatedLeadsRepository.findBy(
            'lead_category_id',
            leadCategory.id,
            {
              clauses: {
                where: {
                  partnerId: partner.id,
                  userId: reactionDto.user_id,
                },
              },
            }
          )

          if (!alreadyReactedToPost) {
            const storeAutomatedLeadService = container.resolve(StoreAutomatedLeadService)
            await storeAutomatedLeadService.run({
              leadType: ILeadCategory.Types.reactPartnerPost,
              partnerId: partner.id,
              refId: partner.id,
              userId: reactionDto.user_id,
            })
          }
        }
      }
    }

    if (reactionDto.user_id !== post.user_id) {
      const addUserPointService = container.resolve(AddPointUserService)
      await addUserPointService.run({
        ref_id: String(reaction.id),
        master_ref_id: String(post.id),
        master_ref_table: 'posts',
        author_id: reactionDto.user_id,
        type: IUserPoint.Types.reactionPost,
        user_id: reactionDto.user_id,
      })
      await addUserPointService.run({
        ref_id: String(reaction.id),
        master_ref_id: String(post.id),
        master_ref_table: 'posts',
        author_id: post.user_id,
        type: IUserPoint.Types.reactionToYourPost,
        user_id: post.user_id,
      })
    }

    await post.load('user')

    await container.resolve(SendPostReactionNotificationService).run({
      ownerId: post.user_id,
      ownerLanguageRefCode: post.user.language,
      newerReactionUser: {
        name: ctx.currentUser.name,
        id: ctx.currentUser.id,
      },
      postId: post.id,
    })

    return reaction
  }
}
