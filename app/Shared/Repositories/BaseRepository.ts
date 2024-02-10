import { LucidModel } from '@ioc:Adonis/Lucid/Orm'
import sharp from 'sharp'
import Drive from '@ioc:Adonis/Core/Drive'
import Env from '@ioc:Adonis/Core/Env'

import IBaseRepository, {
  ContextParams,
  ModelType,
  PaginateContractType,
  PaginateParams,
} from 'App/Shared/Interfaces/BaseInterface'

export default class BaseRepository<Model extends LucidModel> implements IBaseRepository<Model> {
  constructor(protected orm: Model) {}

  /**
   * Repository
   */
  public async list({
    clauses,
    orders,
  }: ContextParams<Model>): Promise<Array<InstanceType<Model>>> {
    const models = this.orm.query()

    if (clauses)
      Object.entries(clauses).find(([key, value]) => {
        if (key === 'where') models.where(value)
        if (key === 'like') {
          const { column, match } = value
          if (column && match) models.where(column, 'LIKE', `%${match}%`)
        }
      })

    if (orders) {
      for (const { column, direction } of orders)
        if (column) models.orderBy(String(column), direction ? direction : 'asc')
    }

    return models
  }

  public async store(values: ModelType<Model>): Promise<InstanceType<Model>> {
    return this.orm.create(values)
  }

  public async storeMany(values: Array<ModelType<Model>>): Promise<Array<InstanceType<Model>>> {
    return this.orm.createMany(values)
  }

  public async save<T extends InstanceType<Model>>(model: T): Promise<T> {
    return model.save()
  }

  /**
   * Helpers
   */
  public async listWithPagination({
    page,
    perPage,
    clauses,
    orders,
    scopes,
  }: PaginateParams<Model>): Promise<PaginateContractType<Model>> {
    const models = this.orm.query()

    if (clauses)
      Object.entries(clauses).find(([key, value]) => {
        if (key === 'where') models.where(value)
        if (key === 'like') {
          const { column, match } = value
          if (column && match) models.where(column, 'LIKE', `%${match}%`)
        }
      })

    if (scopes) models.withScopes(scopes)

    if (orders) {
      for (const { column, direction } of orders)
        if (column) models.orderBy(String(column), direction ? direction : 'asc')
    }

    return models.paginate(page, perPage)
  }

  public async findBy(
    key: string,
    value: any,
    params?: ContextParams<Model>
  ): Promise<InstanceType<Model> | null> {
    const model = this.orm.query().where(key, value)

    if (params) {
      const { clauses, orders, scopes } = params

      if (clauses)
        Object.entries(clauses).find(([key, value]: [string, any]) => {
          if (key === 'where') if (value) model.where(value)

          if (key === 'like') {
            const { column, match } = value
            if (column && match) model.where(column, 'LIKE', `%${match}%`)
          }
        })

      if (scopes) model.withScopes(scopes)

      if (orders)
        for (const { column, direction } of orders)
          if (column) model.orderBy(String(column), direction ? direction : 'asc')
    }

    return model.first()
  }

  public async uploadImage(localSave: string, image: any) {
    const s3 = Drive.use('s3')

    const resizedImageData = await sharp(image.tmpPath).resize(1024).toBuffer()

    return await s3.put(localSave, resizedImageData, {
      visibility: 'public',
      contentType: `image/${image.extname}`
    })
    .then(() => {
      return s3.getUrl(localSave)
    })
  }

  public async deleteImage(localSave: string) {
    const s3 = Drive.use('s3')

    const imageUrl = localSave.replace(Env.get('S3_CDN_URL'), '')

    return await s3.delete(imageUrl)
  }
}
