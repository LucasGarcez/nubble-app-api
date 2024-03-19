import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { container } from 'tsyringe'

import {
  CreatePostReactionService,
  DeletePostReactionService,
  IndexPostReactionService,
  UpdatePostReactionService,
} from 'App/Services/PostReaction'
import { PostReactionValidators } from 'App/Validators/PostReactionValidators'

export default class PostReactionController {

  /**
   * @index
   * @summary List reactions post
   * @tag PostReaction
   * @paramQuery page - Page number - @example(1) @type(integer) @required
   * @paramQuery per_page - Number of items per page - @example(10) @type(integer)
   * @paramQuery post_id - Post id - @example(1) @type(integer) @required
   * @paramQuery reaction_type - Reaction type - @enum(like, favorite) @required
   * @responseBody 200 - <PostReaction[]>.exclude(static_table_post_reactions, post, static_table_posts, static_table_users, serialize_extras_true).with(relations)
   */
  public async index({ request, response }: HttpContextContract): Promise<void> {
    const page = request.input('page', 1)
    const perPage = request.input('per_page', 10)
    const postId = request.input('post_id', null)
    const reactionType = request.input('reaction_type', null)

    const postsReactionService = container.resolve(IndexPostReactionService)

    const posts = await postsReactionService.run(page, perPage, postId, reactionType)

    return response.json(posts)
  }

  /**
   * @store
   * @summary New reaction post
   * @tag PostReaction
   **/
  public async store({ request, response, auth }: HttpContextContract): Promise<void> {
    const userId = auth.user?.id!

    const data = await request.validate(PostReactionValidators.Store)
    const createService = container.resolve(CreatePostReactionService)
    const postReaction = await createService.run({ ...data, user_id: userId })

    return response.json(postReaction)
  }

  /**
   * @update
   * @summary Edit reaction post
   * @tag PostReaction
   **/
  public async update({ request, response, auth }: HttpContextContract): Promise<void> {
    const userId = auth.user?.id!

    const data = await request.validate(PostReactionValidators.Update)
    const updateService = container.resolve(UpdatePostReactionService)
    const postReaction = await updateService.run({ ...data, user_id: userId })

    return response.json(postReaction)
  }

  /**
   * @destroy
   * @summary Delete reaction post
   * @tag PostReaction
   **/
  public async destroy({ request, response, auth }: HttpContextContract): Promise<void> {
    const userId = auth.user?.id!
    const data = await request.validate(PostReactionValidators.Delete)
    const deleteService = container.resolve(DeletePostReactionService)

    await deleteService.run(data.post_id, userId)

    return response.json({ message: 'Reaction deleted.' })
  }
}
