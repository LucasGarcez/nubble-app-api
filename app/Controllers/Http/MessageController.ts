import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Message from 'App/Models/Message'

export default class MessageController {

  /**
   * @index
   * @summary List messages
   * @tag Message
   **/
  public async index({ response }: HttpContextContract) {
    const messages = await Message.all()

    return response.json(messages)
  }

  /**
   * @show
   * @summary Show message
   * @tag Message
   **/
  public async show({ params, response }: HttpContextContract) {
    const message = await Message.findOrFail(params.id)

    return response.json(message)
  }

  /**
   * @store
   * @summary New message
   * @tag Message
   **/
  public async store({ request, response }: HttpContextContract) {
    const data = request.only(['sender_id', 'recipient_id', 'message'])

    const message = await Message.create(data)

    return response.status(201).json(message)
  }

  /**
   * @update
   * @summary Edit message
   * @tag Message
   **/
  public async update({ params, request, response }: HttpContextContract) {
    const message = await Message.findOrFail(params.id)

    const data = request.only(['sender_id', 'recipient_id', 'message'])

    message.merge(data)

    await message.save()

    return response.json(message)
  }

  /**
   * @destroy
   * @summary Delete message
   * @tag Message
   **/
  public async destroy({ params, response }: HttpContextContract) {
    const message = await Message.findOrFail(params.id)

    await message.delete()

    return response.json({ message: 'Message deleted successfully' })
  }
}
