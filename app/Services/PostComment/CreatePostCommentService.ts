import { inject, injectable } from 'tsyringe'

import { IPost } from 'App/Interfaces/IPost'
import { IPostComment } from 'App/Interfaces/IPostComment'
import PostComment from 'App/Models/PostComment'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

@injectable()
export class CreatePostCommentService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPost.Repository,
    @inject('PostCommentRepository')
    private postCommentRepository: IPostComment.Repository
  ) {}

  public async run(commentDto: IPostComment.DTO.Store): Promise<PostComment | null> {
    const post = await this.postsRepository.findBy('id', commentDto.post_id)
    if (!post) throw new NotFoundException('Not found post with this id or post is not available.')

    const comment = await this.postCommentRepository.create(commentDto)

    await post.load('user')

    return this.postCommentRepository.show(comment.id, commentDto.user_id)
  }
}
