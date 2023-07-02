import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { inject, injectable } from 'tsyringe'

import { IPostCommentReaction } from '../../Interfaces/IPostCommentReaction'
import PostCommentReaction from '../../Models/PostCommentReaction'

@injectable()
export class IndexPostCommentReactionService {
  constructor(
    @inject('PostCommentReactionRepository')
    private postCommentReactionRepository: IPostCommentReaction.Repository
  ) {}

  public async run(
    page: number,
    userId: number,
    reactionType: string
  ): Promise<ModelPaginatorContract<PostCommentReaction>> {
    try {
      const reactions = await this.postCommentReactionRepository.index(page, userId, reactionType)

      return reactions
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
