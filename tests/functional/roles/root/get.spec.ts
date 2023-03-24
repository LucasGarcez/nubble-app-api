import { test } from '@japa/runner'

import UserFactory from 'Database/factories/UserFactory'
import RoleFactory from 'Database/factories/RoleFactory'

test.group('Role: Root - Get', () => {
  test('it should be able to get role by id', async ({ client, assert }) => {
    /** create user root */
    const { username } = await UserFactory.merge({ password: 'password' })
      .create()
      .then(async (user) => {
        await user.attachRoleByName('root')
        return user
      })

    /** login with user root */
    const loginResponse = await client.post('/login').json({
      uid: username,
      password: 'password',
    })

    assert.isObject(loginResponse.body())
    assert.properties(loginResponse.body(), ['auth'])

    const token = loginResponse.body().auth.token

    /** make role factory  */
    const role = await RoleFactory.create().then((model) => model.toJSON())

    /** fetch get role */
    const getRole = await client.get(`/admin/roles/${role.id}`).bearerToken(token)
    getRole.assertStatus(200)

    assert.properties(getRole.body(), ['id', 'slug', 'description', 'deletable', 'is_active'])
    assert.deepInclude(getRole.body(), role)
  })
})
