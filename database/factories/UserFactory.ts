import Factory from '@ioc:Adonis/Lucid/Factory'

import User from 'App/Modules/Accounts/Models/User'

export default Factory.define(User, ({ faker }) => {
  return {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }
}).build()
