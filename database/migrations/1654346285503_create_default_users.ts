import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { container } from 'tsyringe'

import { UserServices } from 'App/Modules/Accounts/Services/User'

export default class extends BaseSchema {
  public async up() {
    const userServices = container.resolve(UserServices)
    await userServices.storeDefault()
  }

  public async down() {
    this.schema.raw('truncate table users restart identity cascade;')
  }
}
