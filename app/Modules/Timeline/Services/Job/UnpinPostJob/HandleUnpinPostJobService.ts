import { inject, injectable } from 'tsyringe'

import { IPost } from 'App/Modules/Timeline/Interfaces/IPost'

type HandleUnpinPostJobRequest = {
  postId: number
}

@injectable()
export class HandleUnpinPostJobService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPost.Repository
  ) {}

  public async run({ postId }: HandleUnpinPostJobRequest) {
    const post = await this.postsRepository.findBy('id', postId)

    if (post && post.is_fixed) {
      post.merge({
        is_fixed: false,
        order_date: post.created_at,
      })

      await this.postsRepository.save(post)
    }
  }
}
