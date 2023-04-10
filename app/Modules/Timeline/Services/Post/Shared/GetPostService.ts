import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { inject, injectable } from 'tsyringe'

import { IPost } from 'App/Modules/Timeline/Interfaces/IPost'
import Post from 'App/Modules/Timeline/Models/Post'
import NotFoundException from 'App/Shared/Exceptions/NotFoundException'

import DTO = IPost.DTO

@injectable()
export class GetPostService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPost.Repository
  ) {}

  public async execute({ postId, userId = undefined }: DTO.Get): Promise<Post> {
    const { i18n, currentUser } = HttpContext.get()!

    const post = await this.postsRepository.findBy('id', postId, {
      scopes: (scopes) => {
        if (currentUser.admin) scopes.loadUserForAdmin()
        else scopes.loadUser()
        scopes.loadContents()
        scopes.reactionCount()
        scopes.messageCount()
        scopes.loadPartners()
        scopes.loadAlreadyReact(userId ? userId : currentUser.id)
      },
    })
    if (!post)
      throw new NotFoundException(
        i18n.formatMessage('messages.not_found', {
          model: i18n.formatMessage('models.post'),
        })
      )

    return post
  }
}
