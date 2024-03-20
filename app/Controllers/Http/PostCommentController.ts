import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { container } from 'tsyringe'

import {
  CreatePostCommentService,
  DeletePostCommentService,
  IndexPostCommentService,
  ShowPostCommentService,
  UpdatePostCommentService,
} from 'App/Services/PostComment'
import { PostCommentValidators } from 'App/Validators/PostCommentValidators'

export default class PostCommentController {

  /**
   * @index
   * @summary List post comments
   * @tag PostComment
   * @paramQuery page - Page number - @example(1) @type(integer) @required
   * @paramQuery per_page - Number of items per page - @example(10) @type(integer)
   * @paramQuery post_id - Post id - @example(1) @type(integer) @required
   * @paramQuery search - Search - @example(Ola) @type(string)
   **/
  public async index({ request, response }: HttpContextContract): Promise<void> {
    const page = request.input('page', 1)
    const perPage = request.input('per_page', 10)
    const postId = request.input('post_id', null)

    const indexService = container.resolve(IndexPostCommentService)
    const postComment = await indexService.run(page, postId, perPage)

    return response.json(postComment)
  }

  /**
   * @show
   * @summary Show post comment
   * @tag PostComment
   * @paramPath commentId - Comment id - @example(1) @type(integer)
   **/
  public async show({ params, response }: HttpContextContract): Promise<void> {
    const { commentId } = params

    const showService = container.resolve(ShowPostCommentService)
    const postComment = await showService.run(commentId)

    return response.json(postComment)
  }

  /**
   * @store
   * @summary New post comment
   * @tag PostComment
   **/
  public async store({ request, response, auth }: HttpContextContract): Promise<void> {
    const data = await request.validate(PostCommentValidators.Store)
    const userId = auth.user?.id!

    const createService = container.resolve(CreatePostCommentService)

    const postComment = await createService.run({ ...data, user_id: userId })

    return response.json(postComment)
  }

  /**
   * @update
   * @summary Edit post comment
   * @tag PostComment
   * @paramPath commentId - Comment id - @example(1) @type(integer)
   **/
  public async update({ request, response, params, auth }: HttpContextContract): Promise<void> {
    const data = await request.validate(PostCommentValidators.Update)
    const { commentId } = params
    const userId = auth.user?.id!

    const updateService = container.resolve(UpdatePostCommentService)
    const postComment = await updateService.run({ ...data }, commentId, userId)

    return response.json(postComment)
  }

  /**
   * @destroy
   * @summary Delete post comment
   * @tag PostComment
   * @paramPath commentId - Comment id - @example(1) @type(integer)
   **/
  public async destroy({ response, params, auth }: HttpContextContract): Promise<void> {
    const { commentId } = params
    const userId = auth.user?.id!

    const deleteService = container.resolve(DeletePostCommentService)
    await deleteService.run(commentId, userId)

    return response.json({ message: 'Comment deleted.' })
  }
}
