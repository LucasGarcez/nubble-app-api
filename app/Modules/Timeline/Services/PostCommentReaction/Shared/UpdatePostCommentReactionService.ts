import { container, injectable } from 'tsyringe'

import AppException from '../../../../../Shared/Exceptions/AppException'
import { IPostCommentReaction } from '../../../Interfaces/IPostCommentReaction'
import PostCommentReaction from '../../../Models/PostCommentReaction'
import { CreatePostCommentReactionService } from './CreatePostCommentReactionService'
import { DeletePostCommentReactionService } from './DeletePostCommentReactionService'

@injectable()
export class UpdatePostCommentReactionService {
  constructor() {}

  public async run(reactionDto: IPostCommentReaction.DTO.Store): Promise<PostCommentReaction> {
    try {
      const deleteService = container.resolve(DeletePostCommentReactionService)
      const createService = container.resolve(CreatePostCommentReactionService)

      await deleteService.run(reactionDto.post_comment_id, reactionDto.user_id)

      const reaction = await createService.run(reactionDto)

      return reaction
    } catch (err) {
      throw new AppException(err.message)
    }
  }
}
