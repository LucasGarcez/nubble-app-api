import 'App/Services/container'
import { container } from 'tsyringe'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { EditUserSchema } from 'App/Validators/UserValidator'
import UserServices from 'App/Services/UserServices'

export default class UsersController {

  public async list({ request, response }: HttpContextContract): Promise<void> {
    const page = request.input('page', 1)
    const perPage = request.input('per_page', 10)
    const search = request.input('search', '')
    const userServices = container.resolve(UserServices)
    const users = await userServices.list({ page, perPage, search })
    return response.json(users)
  }

  public async get({ params, response }: HttpContextContract): Promise<void> {
    const { id: userId } = params
    const userServices = container.resolve(UserServices)
    const user = await userServices.get(userId)
    return response.json(user)
  }

  public async edit({ request, params, response }: HttpContextContract): Promise<void> {
    const { id: userId } = params
    const userDto = await request.validate({ schema: EditUserSchema })
    const userServices = container.resolve(UserServices)
    const user = await userServices.edit(userId, userDto)
    return response.json(user)
  }

  public async delete({ params, response }: HttpContextContract): Promise<void> {
    const { id: userId } = params
    const userServices = container.resolve(UserServices)
    await userServices.delete(userId)
    return response.json({ message: 'User deleted successfully.' })
  }
}
