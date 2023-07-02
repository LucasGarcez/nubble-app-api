import {
  BaseModel as BaseAdonisModel,
  beforeFetch,
  beforeFind,
  beforePaginate,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

export default class BaseModel extends BaseAdonisModel {
  /**
   * Hooks
   */
  @beforeFind()
  @beforeFetch()
  public static async ignoreDeleted(query: ModelQueryBuilderContract<any>): Promise<void> {
    if (query.model.$getColumn('is_deleted')) query.whereNot('is_deleted', true)
  }

  @beforePaginate()
  public static ignoreDeletedPaginate(
    queries: [countQuery: ModelQueryBuilderContract<any>, query: ModelQueryBuilderContract<any>]
  ) {
    for (const query of queries)
      if (query.model.$getColumn('is_deleted')) query.whereNot('is_deleted', true)
  }
}
