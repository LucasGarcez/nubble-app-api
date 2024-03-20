import { inject, injectable } from 'tsyringe'

import { IPost } from 'App/Interfaces/IPost'
import { IPostReaction } from 'App/Interfaces/IPostReaction'
import PostReaction from 'App/Models/PostReaction'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

@injectable()
export class CreateUpdatePostReactionService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPost.Repository,
    @inject('PostReactionRepository')
    private postReactionRepository: IPostReaction.Repository
  ) {}

  public async run(reactionDto: IPostReaction.DTO.Show): Promise<PostReaction> {
    const post = await this.postsRepository.findBy('id', reactionDto.post_id)

    if (!post) throw new NotFoundException('Not found post with this id or post is not available.')

    const reactionExists = await this.postReactionRepository.exists(reactionDto)

    if (reactionExists) {
      reactionExists.is_checked = !reactionExists.is_checked
      return this.update(reactionExists)
    }

    return this.create(reactionDto)

  }

  private async create(reactionDto: IPostReaction.DTO.Store): Promise<PostReaction> {
    const reaction = await this.postReactionRepository.store(reactionDto)

    return reaction
  }

  private async update(reactionDto: PostReaction): Promise<PostReaction> {
    const reaction = await this.postReactionRepository.update(reactionDto)

    return reaction
  }
}
