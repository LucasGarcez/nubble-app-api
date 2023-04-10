import { inject, injectable } from 'tsyringe'

import AppException from '../../../../../Shared/Exceptions/AppException'
import { IPostCommentReaction } from '../../../Interfaces/IPostCommentReaction'
import PostCommentReaction from '../../../Models/PostCommentReaction'

@injectable()
export class CreatePostCommentReactionService {
  constructor(
    @inject('PostCommentReactionRepository')
    private postCommentReactionRepository: IPostCommentReaction.Repository
  ) {}

  public async run(reactionDto: IPostCommentReaction.DTO.Store): Promise<PostCommentReaction> {
    try {
      const reaction = await this.postCommentReactionRepository.create(reactionDto)

      return reaction
    } catch (err) {
      throw new AppException(err.message)
    }
  }
}
