import { schema } from '@ioc:Adonis/Core/Validator'

export const StorePostSchema = schema.create({
  text: schema.string({ escape: true, trim: true }),
  content_url: schema.string({ escape: true, trim: true }),
})

export const EditPostSchema = schema.create({
  text: schema.string({ escape: true, trim: true }),
})
