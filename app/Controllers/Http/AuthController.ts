import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { LoginSchema, StoreUserSchema } from 'App/Validators/UserValidator'

import AuthorizationException from 'App/Shared/Exceptions/AuthorizationException'
import UsersRepository from 'App/Repositories/UsersRepository'
import { IUser } from 'App/Interfaces/IUser'

export default class AuthController {
  /**
   * @custom
   * @summary Lorem ipsum dolor sit amet
   * @paramPath provider - The login provider to be used - @enum(google, facebook, apple)
   * @responseBody 200 - {"token": "xxxxxxx"}
   * @requestBody {"code": "xxxxxx"}
   */
  public async login({ request, auth, response }: HttpContextContract): Promise<void> {
    const { uid, password } = await request.validate({ schema: LoginSchema })

    try {
      const token = await auth
        .use('api')
        .attempt(uid, password, { name: 'acl-token', expiresIn: '1h' })

      return response.json({ auth: token, user: auth.user })
    } catch (error) {
      throw new AuthorizationException(
        'Unable to login, please check your crede ntials or try again later.'
      )
    }
  }

  /**
   * @custom
   * @summary Lorem ipsum dolor sit amet
   * @paramPath provider - The login provider to be used - @enum(google, facebook, apple)
   * @responseBody 200 - {"token": "xxxxxxx"}
   * @requestBody <User>
   */
  public async register({ request, response }: HttpContextContract): Promise<void> {
    const userDto: IUser.DTOs.Store = await request.validate({ schema: StoreUserSchema })
    const usersRepository = new UsersRepository()

    const user = await usersRepository.store(userDto)

    return response.json(user)
  }
}
