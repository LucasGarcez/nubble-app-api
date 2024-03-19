import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { inject, injectable } from 'tsyringe'

import { IPostReaction } from '../../Interfaces/IPostReaction'
import PostReaction from '../../Models/PostReaction'

@injectable()
export class IndexPostReactionService {
  constructor(
    @inject('PostReactionRepository')
    private postReactionRepository: IPostReaction.Repository
  ) {}

  public async run(
    page: number,
    perPage: number,
    postId: number,
    reactionType: string
  ): Promise<ModelPaginatorContract<PostReaction>> {
    try {
      const reactions = await this.postReactionRepository.index(page, perPage, postId, reactionType)

      return reactions
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
