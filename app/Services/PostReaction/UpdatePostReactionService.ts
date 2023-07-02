import { container, injectable } from 'tsyringe'

import { IPostReaction } from '../../Interfaces/IPostReaction'
import PostReaction from '../../Models/PostReaction'
import { CreatePostReactionService } from './CreatePostReactionService'
import { DeletePostReactionService } from './DeletePostReactionService'

@injectable()
export class UpdatePostReactionService {
  constructor() {}

  public async run(reactionDto: IPostReaction.DTO.Store): Promise<PostReaction> {
    try {
      const deleteService = container.resolve(DeletePostReactionService)
      const createService = container.resolve(CreatePostReactionService)

      await deleteService.run(reactionDto.post_id, reactionDto.user_id)

      const reaction = await createService.run(reactionDto)

      return reaction
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
