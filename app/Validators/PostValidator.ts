import { schema } from '@ioc:Adonis/Core/Validator'

export const StorePostSchema = schema.create({
  text: schema.string.optional({ escape: true, trim: true }),
  imageUrl: schema.string({ escape: true, trim: true }),
})

export const EditPostSchema = schema.create({
  text: schema.string.optional({ escape: true, trim: true }),
})
