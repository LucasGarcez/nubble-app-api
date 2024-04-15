import { container } from 'tsyringe'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { EditPostSchema, StorePostSchema, ValidateImageSchema } from 'App/Validators/PostValidator'

import PostServices from 'App/Services/PostService'
import { IPost } from 'App/Interfaces/IPost'

export default class PostsController {

  /**
   * @index
   * @summary List posts
   * @tag Posts
   * @paramQuery page - Page number - @example(1) @type(integer) @required
   * @paramQuery per_page - Number of items per page - @example(10) @type(integer)
   * @paramQuery search - Search - @example(Bom dia) @type(string)
   */
  public async index({ request, response, auth }: HttpContextContract): Promise<void> {
    const userId = auth.user?.id!

    const page = request.input('page', 1)
    const perPage = request.input('per_page', 10)
    const search = request.input('search', '')

    const postsService = container.resolve(PostServices)
    const posts = await postsService.list({ page, perPage, search, userId })
    return response.json(posts)
  }

  /**
   * @show
   * @summary Show post
   * @tag Posts
   * @paramPath id - Post id - @example(1) @type(integer)
   */
  public async show({ params, response, auth }: HttpContextContract): Promise<void> {
    const userId = auth.user?.id!

    const { id: postId } = params
    const postsService = container.resolve(PostServices)
    const post = await postsService.get(postId, userId)

    return response.json(post)
  }

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
   * @update
   * @summary Edit post
   * @tag Posts
   * @paramPath id - Post id - @example(1) @type(integer)
   * @requestBody <Post>.exclude(id, user_id, static_table_posts, serialize_extras_true)
   */
  public async update({ request, params, response }: HttpContextContract): Promise<void> {
    const { id: postId } = params
    const postDto: IPost.DTO.Store = await request.validate({ schema: EditPostSchema })
    const image = await request.validate({ schema: ValidateImageSchema })

    const postsService = container.resolve(PostServices)

    const post = await postsService.edit(postId, postDto, image)
    return response.json(post)
  }

  /**
   * @destroy
   * @summary Delete post
   * @tag Posts
   * @paramPath id - Post id - @example(1) @type(integer)
   */
  public async destroy({ params, response }: HttpContextContract): Promise<void> {
    const { id: postId } = params
    const postsService = container.resolve(PostServices)
    await postsService.delete(postId)
    return response.json({ message: 'Post deleted successfully.' })
  }
}
