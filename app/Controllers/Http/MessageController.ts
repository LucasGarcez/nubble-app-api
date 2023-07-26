import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Message from 'App/Models/Message'
import { MessageValidator } from 'App/Validators/MessageValidator'

export default class MessageController {
  public async index({ response }: HttpContextContract) {
    const messages = await Message.all()

    return response.json(messages)
  }

  public async show({ params, response }: HttpContextContract) {
    const message = await Message.findOrFail(params.id)

    return response.json(message)
  }

  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(MessageValidator.Store)
    const message = await Message.create(data)

    return response.status(201).json(message)
  }

  public async update({ params, request, response }: HttpContextContract) {
    const data = await request.validate(MessageValidator.Update)
    const message = await Message.findOrFail(params.id)

    message.message = data.message

    await message.save()

    return response.json(message)
  }

  public async destroy({ params, response }: HttpContextContract) {
    const message = await Message.findOrFail(params.id)

    await message.delete()

    return response.json({ message: 'Message deleted successfully' })
  }
}
