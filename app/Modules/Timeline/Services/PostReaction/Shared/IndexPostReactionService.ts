import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { inject, injectable } from 'tsyringe'

import AppException from '../../../../../Shared/Exceptions/AppException'
import { IPostReaction } from '../../../Interfaces/IPostReaction'
import PostReaction from '../../../Models/PostReaction'

@injectable()
export class IndexPostReactionService {
  constructor(
    @inject('PostReactionRepository')
    private postReactionRepository: IPostReaction.Repository
  ) {}

  public async run(
    page: number,
    userId: number,
    reactionType: string
  ): Promise<ModelPaginatorContract<PostReaction>> {
    try {
      const reactions = await this.postReactionRepository.index(page, userId, reactionType)

      return reactions
    } catch (err) {
      throw new AppException(err.message)
    }
  }
}
