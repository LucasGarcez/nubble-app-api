// app/Shared/Middleware/RefreshTokenMiddleware.ts

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'

export default class RefreshTokenMiddleware {
  public async handle({ auth, request, response }: HttpContextContract, next: () => Promise<void>) {
    try {
      await next()
    } catch (error) {
      if (error.code === 'E_UNAUTHORIZED_ACCESS') {
        let refreshToken = request.header('authorization')
            refreshToken = refreshToken?.slice(7)

        if (!refreshToken) {
          return response.unauthorized({ message: 'Token não informado' })
        }

        try {
          const user = await User.findByValidRefreshToken(refreshToken)

          if (!user) {
            return response.unauthorized({ message: 'Token inválido ou expirado' })
          }

          // Gere um novo refresh token e armazene no banco de dados
          const newRefreshToken = await auth.use('api').generate(user, {
            expiresIn: Env.get('TOKEN_EXPIRES_IN') || '30 days'
          })

          user.rememberMeToken = newRefreshToken.toJSON().token
          await user.save()

          response.ok({
            access_token: newRefreshToken.toJSON().token
          })
        } catch (error) {
          response.unauthorized({ message: 'Token inválido ou expirado' })
        }
      } else {
        throw error
      }
    }
  }
}
