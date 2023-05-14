import { schema, rules } from '@ioc:Adonis/Core/Validator'

export const StoreUserSchema = schema.create({
  first_name: schema.string({ escape: true, trim: true }, [
    rules.minLength(4),
    rules.maxLength(80),
  ]),
  last_name: schema.string({ escape: true, trim: true }, [rules.minLength(4), rules.maxLength(80)]),
  username: schema.string({ escape: true, trim: true }, [
    rules.requiredIfNotExists('username'),
    rules.unique({ table: 'users', column: 'username', whereNot: { is_deleted: true } }),
  ]),
  email: schema.string({ escape: true, trim: true }, [
    rules.email(),
    rules.requiredIfNotExists('email'),
    rules.unique({ table: 'users', column: 'email', whereNot: { is_deleted: true } }),
  ]),
  password: schema.string({ escape: true, trim: true }, [rules.confirmed()]),
})

export const EditUserSchema = schema.create({
  first_name: schema.string.optional({ escape: true, trim: true }, [
    rules.minLength(4),
    rules.maxLength(80),
  ]),
  last_name: schema.string.optional({ escape: true, trim: true }, [
    rules.minLength(4),
    rules.maxLength(80),
  ]),
  username: schema.string.optional({ escape: true, trim: true }, [
    rules.requiredIfNotExists('email'),
    rules.unique({ table: 'users', column: 'username', whereNot: { is_deleted: true } }),
  ]),
  email: schema.string.optional({ escape: true, trim: true }, [
    rules.email(),
    rules.requiredIfNotExists('username'),
    rules.unique({ table: 'users', column: 'email', whereNot: { is_deleted: true } }),
  ]),
  password: schema.string.optional({ escape: true, trim: true }, [rules.confirmed()]),
})

export const LoginSchema = schema.create({
  uid: schema.string({ trim: true }, []),
  password: schema.string({ trim: true }),
})
