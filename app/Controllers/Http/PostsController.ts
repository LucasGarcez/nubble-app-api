import { container } from 'tsyringe'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { EditPostSchema, StorePostSchema, ValidateImageSchema } from 'App/Validators/PostValidator'

import PostServices from 'App/Services/PostService'
import { IPost } from 'App/Interfaces/IPost'

export default class PostsController {

  /**
   * @store
   * @summary New post
   * @tag Posts
   * @requestBody <Post>.exclude(id, image_url, static_table_posts, serialize_extras_true).append("imageCover": "binary")
   */
  public async store({ request, response, auth }: HttpContextContract): Promise<void> {
    const userId = auth.user?.id!

    const postDto: IPost.DTO.Store = await request.validate({ schema: StorePostSchema })
    const image = await request.validate({ schema: ValidateImageSchema })

    const postsService = container.resolve(PostServices)
    postDto.user_id = userId
    const post = await postsService.store(postDto, image)

    return response.json(post)
  }

  /**
   * @list
   * @summary List posts
   * @tag Posts
   */
  public async list({ request, response }: HttpContextContract): Promise<void> {
    const page = request.input('page', 1)
    const perPage = request.input('per_page', 10)
    const search = request.input('search', '')

    const postsService = container.resolve(PostServices)
    const posts = await postsService.list({ page, perPage, search })
    return response.json(posts)
  }

  /**
   * @get
   * @summary Show post
   * @tag Posts
   */
  public async get({ params, response }: HttpContextContract): Promise<void> {
    const { id: postId } = params
    const postsService = container.resolve(PostServices)
    const post = await postsService.get(postId)
    return response.json(post)
  }

  /**
   * @edit
   * @summary Edit post
   * @tag Posts
   * @requestBody <Post>.exclude(id, user_id, static_table_posts, serialize_extras_true)
   */
  public async edit({ request, params, response }: HttpContextContract): Promise<void> {
    const { id: postId } = params
    const postDto: IPost.DTO.Store = await request.validate({ schema: EditPostSchema })
    const image = await request.validate({ schema: ValidateImageSchema })

    const postsService = container.resolve(PostServices)

    const post = await postsService.edit(postId, postDto, image)
    return response.json(post)
  }

  /**
   * @delete
   * @summary Delete post
   * @tag Posts
   */
  public async delete({ params, response }: HttpContextContract): Promise<void> {
    const { id: postId } = params
    const postsService = container.resolve(PostServices)
    await postsService.delete(postId)
    return response.json({ message: 'Post deleted successfully.' })
  }
}
