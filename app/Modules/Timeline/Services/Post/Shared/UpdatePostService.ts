import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { container, inject, injectable } from 'tsyringe'

import { IPost } from 'App/Modules/Timeline/Interfaces/IPost'
import { IPostContent } from 'App/Modules/Timeline/Interfaces/IPostContent'
import Post from 'App/Modules/Timeline/Models/Post'
import { UpdateManyPostService } from 'App/Modules/Timeline/Services/PostContent/Shared'
import AppException from 'App/Shared/Exceptions/AppException'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

import DTO = IPost.DTO

@injectable()
export class UpdatePostService {
  constructor(
    @inject('PostsRepository') private postsRepository: IPost.Repository,
    @inject('PostContentRepository') private postContentRepository: IPostContent.Repository
  ) {}

  private updateManyPost = container.resolve(UpdateManyPostService)

  public async execute(
    postId: number,
    userId: number,
    postDto: DTO.UpdateWithContent
  ): Promise<Post | null> {
    const { i18n } = HttpContext.get()!

    const post = await this.postsRepository.findBy('id', postId)
    if (!post)
      throw new NotFoundException(
        i18n.formatMessage('messages.not_found', {
          model: i18n.formatMessage('models.post'),
        })
      )
    if (post.user_id !== userId) throw new AppException(i18n.formatMessage('messages.not_allow'))

    /**
     * merge and save post
     */
    post.merge({
      text: postDto.text,
    })
    await this.postsRepository.save(post)

    /**
     * update post if exists contents
     */
    const contents = postDto.contents
    if (contents && contents.length > 0) {
      const contentsDto = contents.map((content, index) => {
        return { ...content, user_id: post.user_id, post_id: post.id, order: index }
      })

      const existingContents = contentsDto.filter((content) => content.id)
      if (existingContents.length > 0) await this.updateManyPost.run(existingContents)

      const newContents = contentsDto.filter((content) => !content.id)
      if (newContents.length > 0) await this.postsRepository.createManyContents(newContents, post)

      await post.load('contents')
      const notDeleteIds = post.contents.map((content) => content.id)
      if (notDeleteIds.length > 0)
        await this.postContentRepository.deleteFromPost(post.id, notDeleteIds)
    }

    return this.postsRepository.findBy('id', post.id, {
      scopes: (scopes) => {
        scopes.loadContents()
        scopes.loadUser()
        scopes.reactionCount()
        scopes.messageCount()
        scopes.loadAlreadyReact(post.user_id)
      },
    })
  }
}
