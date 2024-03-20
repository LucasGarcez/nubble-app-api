import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { container } from 'tsyringe'

import {
  CreateUpdatePostReactionService,
  DeletePostReactionService,
  IndexPostReactionService,
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
   * @storeUpdate
   * @summary New reaction post
   * @tag PostReaction
   * @paramPath postId - Post id - @example(1) @type(integer) @required
   * @paramPath emojiType - Emoji type - @enum(like, favorite) @required
   **/
  public async storeUpdate({ request, params, response, auth }: HttpContextContract): Promise<void> {
    const userId = auth.user?.id!
    request.updateBody({ post_id: params.postId, user_id: userId, emoji_type: params.emojiType })

    const data = await request.validate(PostReactionValidators.StoreUpdate)

    const createService = container.resolve(CreateUpdatePostReactionService)

    const postReaction = await createService.run({ ...data })

    return response.json(postReaction)
  }

  /**
   * @destroy
   * @summary Delete reaction post
   * @tag PostReaction
   * @paramPath postId - Post id - @example(1) @type(integer) @required
   * @paramPath emojiType - Emoji type - @enum(like, favorite) @required
   **/
  public async destroy({ request, params, response, auth }: HttpContextContract): Promise<void> {
    const userId = auth.user?.id!
    request.updateBody({ post_id: params.postId, user_id: userId, emoji_type: params.emojiType })

    const data = await request.validate(PostReactionValidators.Delete)
    const deleteService = container.resolve(DeletePostReactionService)

    await deleteService.run(data.post_id, data.user_id, data.emoji_type)

    return response.json({ message: 'Reaction deleted.' })
  }
}
