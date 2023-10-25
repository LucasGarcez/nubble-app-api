import { JWTCustomPayloadData } from '@ioc:Adonis/Addons/Jwt';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import jwt_decode from "jwt-decode";

/**
 * ------------------------------------------------------
 * Refresh Token Middleware
 * ------------------------------------------------------
 * - This middleware is responsible for refresh JWT token
 * - I recommend using Refresh Token on the front end
 * - Usage: Route.middleware('refreshToken')
 *
 * @class RefreshTokenMiddleware
 * ------------------------------------------------------
 **/
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
          // Get payload data from JWT expired
          const { data: jwtData } = jwt_decode(refreshToken) as JWTCustomPayloadData;

          // Get user data from user id in JWT payload
          const userData = await User.find(jwtData.userId)

          if (!userData) {
            return response.unauthorized({ message: 'Usuário não encontrado' })
          }

          if (userData.rememberMeToken) {
            // Generate new JWT and refresh token by find user rememberMeToken in database
            const jwt = await auth.use('jwt').loginViaRefreshToken(userData.rememberMeToken, {
              expiresIn: Env.get('TOKEN_EXPIRES_IN') || '30m',
              refreshTokenExpiresIn: Env.get('REFRESH_TOKEN_EXPIRES_IN') || '30d'
            });

            const user = auth.use('jwt').user as User
            user.rememberMeToken = jwt?.toJSON().refreshToken.toString() ?? null
            await user.save()

            return response.ok({ auth: jwt, user })
          }

        } catch (error) {
          return response.unauthorized({ message: 'Token inválido ou expirado' })
        }
      } else {
        throw error
      }
    }
  }
}
