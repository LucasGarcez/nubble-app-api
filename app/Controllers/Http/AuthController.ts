import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { StoreUserSchema } from 'App/Validators/UserValidator'

import AuthorizationException from 'App/Shared/Exceptions/AuthorizationException'
import UsersRepository from 'App/Repositories/UsersRepository'
import { IUser } from 'App/Interfaces/IUser'

export default class AuthController {
  /**
   * @login
   * @summary Lorem ipsum dolor sit amet
   * @responseBody 200 - {"token": "xxxxxxx"}
   * @requestBody {"email": "string", "password": "string"}
   */
  public async login({ request, auth, response }: HttpContextContract): Promise<void> {
    const { email, password } = request.only(['email', 'password']);

    try {
      const token = await auth
        .use('api')
        .attempt(email, password)

      return response.json({ auth: token })
    } catch (error) {
      throw new AuthorizationException(
        'Unable to login, please check your crede ntials or try again later.'
      )
    }
  }

  /**
   * @register
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
