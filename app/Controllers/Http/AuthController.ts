import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { ForgotPasswordSchema, StoreUserSchema, LoginSchema, EditPasswordSchema } from 'App/Validators/UserValidator'
import AuthorizationException from 'App/Shared/Exceptions/AuthorizationException'
import UsersRepository from 'App/Repositories/UsersRepository'
import { IUser } from 'App/Interfaces/IUser'
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'
import crypto from 'crypto'
import generator from 'generate-password'
import { isAfter, addHours } from 'date-fns'

export default class AuthController {
  /**
   * @login
   * @summary Login endpoint
   * @responseBody 200 - { "auth": {"type": "string", "token": "string"}}
   * @responseBody 401 - {"message": "Unable to login, please check your credentials or try again later."}
   * @requestBody {"email": "string", "password": "string"}
   */
  public async login({ request, auth, response }: HttpContextContract): Promise<void> {
    try {
      const userDto: IUser.DTOs.Login = await request.validate({ schema: LoginSchema })

      const token = await auth
        .use('api')
        .attempt(userDto.email, userDto.password);

      return response.json({ auth: token })
    } catch (error) {
      throw new AuthorizationException(
        'Unable to login, please check your credentials or try again later.'
      )
    }
  }

  /**
   * @logout
   * @summary Logout endpoint
   * @responseBody 200 - {"message": "Logout successfully"}
   */
  public async logout({ auth, response }: HttpContextContract): Promise<void> {
    const userId: any = auth.user?.id
    const user = await User.query().where('id', userId).firstOrFail()
    user.remember_me_token = null
    user.save()

    await auth.use('api').revoke()
    auth.use('api').isLoggedOut

    return response.json({ message: 'Logout successfully' })
  }

  /**
   * @register
   * @summary Register endpoint
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

  /**
   * @forgotPassword
   * @summary Forgot Password endpoint
   * @responseBody 200 - {"message": "Token sent to your email"}
   * @responseBody 401 - {"errors": [{"message": "User not found"}]}
   * @requestBody {"email": "string"}
   */
  public async forgotPassword({ request, response }: HttpContextContract): Promise<void> {
    try {
      const userDto: IUser.DTOs.ForgotPassword = await request.validate({schema: ForgotPasswordSchema})

      const user = await User.findBy('email', userDto.email)

      if (!user) {
        return response.status(401).json({ errors: [{ message: 'User not found' }] })
      }

      const tempToken = crypto.randomBytes(10).toString('hex')

      const pass = generator.generate({
        length: 10,
        numbers: true,
      })

      const encodedEmail = Buffer.from(user.email).toString('base64')
      const encodedPasswordTemp = Buffer.from(pass).toString('base64')

      user.temp_token = tempToken
      user.temp_password = encodedPasswordTemp
      user.temp_token_created_at = new Date()

      await user.save()

      const emailTo = Env.get('MAIL_SEND_TEST') === 'true'
      ? Env.get('MAIL_SEND_TEST_TO')
      : user.email

      await Mail.send((message) => {
        message
          .from(Env.get('MAIL_SENDER'))
          .to(emailTo)
          .subject('Forgot Password!')
          .htmlView('emails/forgot_password', {
            user : {
              fullName: user.full_name,
              password: pass
            },
            url: `${Env.get('RESET_PASSWORD_URL')}/${tempToken}/${encodedEmail}`,
          })
      })

    return response.status(200).json({ message: 'Token sent to your email' })

    } catch (error) {
      return response.status(400).json({ errors: [{ message: 'Error to request new token' }] })
    }

  }

  /**
   * @resetPassword
   * @summary Reset Password endpoint
   * @responseBody 200 - {"message": "Password changed successfully"}
   * @responseBody 401 - {"errors": [{"message": "User not found"}]}
   * @requestBody {"token": "string", "email": "string"}
   */
  public async resetPassword({ params, response }: HttpContextContract): Promise<void> {
    try {
      const { tempToken, email } = params

      const emailToString = atob(email);

      const user = await User.findBy('email', emailToString)

      if (!user) {
        return response.status(401).json({ errors: [{ message: 'User not found' }] })
      }

      const sameToken = tempToken === user.temp_token

      if (!sameToken) {
        return response
          .status(401)
          .json({ errors: [{ message: 'Token not found' }] })
      }

      const dateToCompare = addHours(user.temp_token_created_at!, 3)

      const isExpiredToken = isAfter(new Date(), dateToCompare)

      if (isExpiredToken) {
        return response.status(401).json({ errors: [{ message: 'Token expired' }] })
      }

      user.password = user.temp_password ? atob(user.temp_password) : user.password
      user.temp_password = null
      user.temp_token = null
      user.temp_token_created_at = null

      await user.save()

      return response.status(200).json({ message: 'Password changed successfully' })
    } catch (error) {
      return response.status(400).json({ errors: [{ message: 'User not found' }] })
    }
  }

  /**
   * @editPassword
   * @summary Edit Password endpoint
   * @responseBody 200 - {"message": "Password changed successfully"}
   * @responseBody 401 - {"errors": [{"message": "User not found"}]}
   * @requestBody {"password": "string"}
   */
  public async editPassword({ request, auth, response }: HttpContextContract): Promise<void> {
    const userDto: IUser.DTOs.EditPassword = await request.validate({ schema: EditPasswordSchema })

    const user = await User.findBy('id', auth.user?.id)

    if (!user) {
      return response.status(401).json({ errors: [{ message: 'User not found' }] })
    }

    const samePassword = await Hash.verify(user.password, userDto.password)

    if (!samePassword) {
      return response.status(401).json({ errors: [{ message: 'Current password is wrong' }] })
    }

    user.password = userDto.password

    await user.save()

    return response.status(200).json({ message: 'Password changed successfully' })
  }

}
