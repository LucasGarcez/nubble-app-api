import { inject, injectable } from 'tsyringe'

import { IPostReaction } from '../../Interfaces/IPostReaction'

@injectable()
export class DeletePostReactionService {
  constructor(
    @inject('PostReactionRepository')
    private postReactionRepository: IPostReaction.Repository
  ) {}

  public async run(postId: number, userId: number, emojiType: string): Promise<boolean> {
    try {
      await this.postReactionRepository.deleteFromPost(postId, userId, emojiType)

      return true
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
