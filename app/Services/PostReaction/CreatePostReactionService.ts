import { inject, injectable } from 'tsyringe'

import { IPost } from 'App/Interfaces/IPost'
import { IPostReaction } from 'App/Interfaces/IPostReaction'
import PostReaction from 'App/Models/PostReaction'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

@injectable()
export class CreatePostReactionService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPost.Repository,
    @inject('PostReactionRepository')
    private postReactionRepository: IPostReaction.Repository
  ) {}

  public async run(reactionDto: IPostReaction.DTO.Store): Promise<PostReaction> {
    const post = await this.postsRepository.findBy('id', reactionDto.post_id)

    if (!post) throw new NotFoundException('Not found post with this id or post is not available.')

    const reaction = await this.postReactionRepository.create(reactionDto)

    await post.load('user')

    return reaction
  }
}
