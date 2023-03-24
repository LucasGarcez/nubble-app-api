import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new AuthorizationException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class AuthorizationException extends Exception {
  constructor(message: string, status = 401) {
    super(message, status)
  }

  public async handle(error: this, { response }: HttpContextContract) {
    response.status(error.status).json({ message: this.message, status: this.status })
  }
}
