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
   **/
  public async show({ request, response, params }: HttpContextContract): Promise<void> {
    const { commentId } = params
    const currentUser = request.input('user')

    const showService = container.resolve(ShowPostCommentService)
    const postComment = await showService.run(commentId, currentUser.id)

    return response.json(postComment)
  }

  /**
   * @store
   * @summary New post comment
   * @tag PostComment
   **/
  public async store({ request, response, auth }: HttpContextContract): Promise<void> {
    const data = await request.validate(PostCommentValidators.Store)
    const currentUser = auth.user

    const createService = container.resolve(CreatePostCommentService)

    const postComment = await createService.run({ ...data, user_id: currentUser?.id })

    return response.json(postComment)
  }

  /**
   * @update
   * @summary Edit post comment
   * @tag PostComment
   **/
  public async update({ request, response, params }: HttpContextContract): Promise<void> {
    const data = await request.validate(PostCommentValidators.Update)
    const { commentId } = params
    const currentUser = request.input('user')

    const updateService = container.resolve(UpdatePostCommentService)
    const postComment = await updateService.run({ ...data }, commentId, currentUser.id)

    return response.json(postComment)
  }

  /**
   * @destroy
   * @summary Delete post comment
   * @tag PostComment
   **/
  public async destroy({ response, params,  auth }: HttpContextContract): Promise<void> {
    const { commentId } = params

    const currentUser = auth.user

    const deleteService = container.resolve(DeletePostCommentService)
    await deleteService.run(commentId, currentUser?.id)

    return response.json({ message: 'Comment deleted.' })
  }
}
