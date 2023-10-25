import { schema, rules } from '@ioc:Adonis/Core/Validator'

export const StoreUserSchema = schema.create({
  firstName: schema.string({ escape: true, trim: true }, [
    rules.minLength(4),
    rules.maxLength(80),
  ]),
  lastName: schema.string({ escape: true, trim: true }, [rules.minLength(4), rules.maxLength(80)]),
  username: schema.string({ escape: true, trim: true }, [
    rules.requiredIfNotExists('username'),
    rules.unique({ table: 'users', column: 'username', whereNot: { is_deleted: true } }),
  ]),
  email: schema.string({ escape: true, trim: true }, [
    rules.email(),
    rules.requiredIfNotExists('email'),
    rules.unique({ table: 'users', column: 'email', whereNot: { is_deleted: true } }),
  ]),
  password: schema.string({ escape: true, trim: true },[rules.minLength(4)]),
})

export const EditUserSchema = schema.create({
  firstName: schema.string.optional({ escape: true, trim: true }, [
    rules.minLength(4),
    rules.maxLength(80),
  ]),
  lastName: schema.string.optional({ escape: true, trim: true }, [
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
  email: schema.string({ trim: true }, [rules.email()]),
  password: schema.string({ trim: true }),
  rememberMe: schema.boolean.optional(),
})

export const ForgotPasswordSchema = schema.create({
  email: schema.string({ trim: true }, [rules.email()]),
})

export const EditPasswordSchema = schema.create({
  password: schema.string({ trim: true }, [rules.confirmed()]),
})

export const ForgotPasswordSchema = schema.create({
  email: schema.string({ trim: true }, [rules.email()]),
})

export const EditPasswordSchema = schema.create({
  password: schema.string({ trim: true }, [rules.confirmed()]),
})
