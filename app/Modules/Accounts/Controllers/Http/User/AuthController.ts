import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { container } from 'tsyringe'

import { LoginSchema, StoreUserSchema } from 'App/Modules/Accounts/Validators/User'

import AuthorizationException from 'App/Shared/Exceptions/AuthorizationException'
import UsersRepository from 'App/Modules/Accounts/Repositories/UsersRepository'
import { RoleServices } from 'App/Modules/Accounts/Services/Admin'

export default class AuthController {
  public async login({ request, auth, response }: HttpContextContract): Promise<void> {
    const { uid, password } = await request.validate({ schema: LoginSchema })

    try {
      const token = await auth
        .use('api')
        .attempt(uid, password, { name: 'acl-token', expiresIn: '1h' })

      return response.json({ auth: token, user: auth.user })
    } catch (error) {
      throw new AuthorizationException(
        'Unable to login, please check your credentials or try again later.'
      )
    }
  }

  public async register({ request, response }: HttpContextContract): Promise<void> {
    const userDto = await request.validate({ schema: StoreUserSchema })
    const usersRepository = new UsersRepository()
    const roleServices = container.resolve(RoleServices)

    const user = await usersRepository.store(userDto)
    const { id: roleId } = await roleServices.getByName('user')
    await user.related('roles').attach([roleId])

    return response.json(user)
  }
}
