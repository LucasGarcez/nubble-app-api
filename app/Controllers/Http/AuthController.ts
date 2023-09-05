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
   * @responseBody 200 - { "auth": {"type": "bearer", "token": "string"}}
   * @responseBody 422 - { "errors": [{"rule": "required", "field": "email", "message": "required validation failed"}]}
   * @responseBody 401 - {"message": "Unable to login, please check your credentials or try again later."}
   * @requestBody {"email": "mariajulia@coffstack.com", "password": "password"}
   */
  public async login({ request, auth, response }: HttpContextContract): Promise<void> {
    try {
      const userDto: IUser.DTOs.Login = await request.validate({ schema: LoginSchema })

      const token = await auth
        .use('api')
        .attempt(userDto.email, userDto.password);

      return response.json({ auth: token, user: auth.user})
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
   * @responseBody 401 - {"errors": [{"message": "E_UNAUTHORIZED_ACCESS: Unauthorized access"}]}
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
   * @isUsernameAvailable
   * @summary ValidateUsername endpoint
   * @responseBody 200 - {"message": ["username is not available", "OR", "username is available"], "isAvailable": ["false","OR", "true"]}
   * @responseBody 400 - {"message": "username is required"}
   * @responseBody 500 - {"message": "Internal server error"}
   * @requestBody {"username": "lucas123"}
   */
  public async isUsernameAvailable({ request, response }: HttpContextContract) {
    try {
      const username = request.input('username')

      if (!username) {
        return response.status(400).json({ message: 'username is required' })
      }

      // Check if the username already exists in the database
      const existingUser = await User.findBy('username', username)

      if (existingUser) {
        return response.status(200).json({ message: 'username is not available', isAvailable: false })
      } else {username
        return response.status(200).json({ message: 'username is available',  isAvailable: true })
      }
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' })
    }
  }
  public async isEmailAvailable({ request, response }: HttpContextContract) {
    try {
      const email = request.input('email')

      if (!email) {
        return response.status(400).json({ message: 'email is required' })
      }

      // Check if the email already exists in the database
      const existingUser = await User.findBy('email', email)

      if (existingUser) {
        return response.status(200).json({ message: 'email is not available', isAvailable: false })
      } else {email
        return response.status(200).json({ message: 'email is available', isAvailable: true })
      }
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  /**
   * @register
   * @summary Register endpoint
   * @paramPath provider - The login provider to be used - @enum(google, facebook, apple)
   * @responseBody 200 - {"first_name": "Lucas","last_name": "Garcez","username": "lucas123","email": "lucas123@gmail.com","full_name": "Lucas Garcez","id": "number"}
   * @responseBody 422 - { "errors": [{"rule": "unique", "field": "username", "message": "unique validation failure"}]}
   * @requestBody {"firstName": "Lucas","lastName": "Garcez","username": "lucas123","email": "lucas123@gmail.com","password": "password","password_confirmation": "password"}
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
