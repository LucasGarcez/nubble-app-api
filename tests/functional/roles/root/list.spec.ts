import { test } from '@japa/runner'

import UserFactory from 'Database/factories/UserFactory'

test.group('Role: Root - List', () => {
  test('it should be able to list all roles', async ({ client, assert }) => {
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

    /** fetch list all roles */
    const listRoles = await client.get('/admin/roles').bearerToken(token)
    listRoles.assertStatus(200)

    assert.isObject(listRoles.body())
    assert.properties(listRoles.body(), ['meta', 'data'])

    const { meta, data } = listRoles.body()
    assert.isObject(meta)
    assert.isArray(data)

    assert.properties(meta, [
      'total',
      'per_page',
      'current_page',
      'last_page',
      'first_page',
      'first_page_url',
      'last_page_url',
      'next_page_url',
      'previous_page_url',
    ])

    for (const obj of data)
      assert.properties(obj, ['id', 'slug', 'description', 'deletable', 'is_active'])
  })
})
