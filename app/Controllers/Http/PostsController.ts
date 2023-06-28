import { container } from 'tsyringe'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { EditPostSchema, StorePostSchema } from 'App/Validators/PostValidator'

import PostServices from 'App/Services/PostService'
import { IPost } from 'App/Interfaces/IPost'
import PostRepository from 'App/Repositories/PostsRepository'

export default class PostController {
  public async store({ request, response }: HttpContextContract): Promise<void> {
    const postDto: IPost.DTO.Store = await request.validate({ schema: StorePostSchema })
    const postsRepository = new PostRepository()

    const post = await postsRepository.store(postDto)

    return response.json(post)
  }
  public async list({ request, response }: HttpContextContract): Promise<void> {
    const page = request.input('page', 1)
    const perPage = request.input('per_page', 10)
    const search = request.input('search', '')
    const postsService = container.resolve(PostServices)
    const posts = await postsService.list({ page, perPage, search })
    return response.json(posts)
  }

  public async get({ params, response }: HttpContextContract): Promise<void> {
    const { id: postId } = params
    const postsService = container.resolve(PostServices)
    const post = await postsService.get(postId)
    return response.json(post)
  }

  public async edit({ request, params, response }: HttpContextContract): Promise<void> {
    const { id: postId } = params
    const postDto = await request.validate({ schema: EditPostSchema })
    const postsService = container.resolve(PostServices)
    const post = await postsService.edit(postId, postDto)
    return response.json(post)
  }

  public async delete({ params, response }: HttpContextContract): Promise<void> {
    const { id: postId } = params
    const postsService = container.resolve(PostServices)
    await postsService.delete(postId)
    return response.json({ message: 'Post deleted successfully.' })
  }
}
