import { inject, injectable } from 'tsyringe'

import AppException from '../../../../../Shared/Exceptions/AppException'
import { IPostReaction } from '../../../Interfaces/IPostReaction'

@injectable()
export class DeletePostReactionService {
  constructor(
    @inject('PostReactionRepository')
    private postReactionRepository: IPostReaction.Repository
  ) {}

  public async run(postId: number, userId: number): Promise<boolean> {
    try {
      await this.postReactionRepository.deleteFromPost(postId, userId)

      return true
    } catch (err) {
      throw new AppException(err.message)
    }
  }
}
