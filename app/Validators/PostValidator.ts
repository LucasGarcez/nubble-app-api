import { schema } from '@ioc:Adonis/Core/Validator'

export const StorePostSchema = schema.create({
  text: schema.string({ escape: true, trim: true }),
})

export const ValidateImageSchema = schema.create({
  imageCover: schema.file({
    size: '10mb',
    extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP']
  }),
})

export const EditPostSchema = schema.create({
  text: schema.string({ escape: true, trim: true }),
})
