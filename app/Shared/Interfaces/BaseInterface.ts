import {
  ExtractScopes,
  LucidModel,
  LucidRow,
  ModelAttributes,
  ModelPaginatorContract,
} from '@ioc:Adonis/Lucid/Orm'
import { SimplePaginatorContract } from '@ioc:Adonis/Lucid/Database'

/**
 * ------------------------------------------------------
 * Base Repository Interface
 * ------------------------------------------------------
 * - This a base interface methods for model repositories
 */
export default interface BaseInterface<Model extends LucidModel> extends Helpers<Model> {
  /**
   * Fetch all rows with clauses
   */
  list(params?: ContextParams<Model>): Promise<Array<InstanceType<Model>>>

  /**
   * Create model and return its instance back
   */
  store(values: Partial<ModelAttributes<InstanceType<Model>>>): Promise<InstanceType<Model>>

  /**
   * Create many of model instances
   */
  storeMany(values: Array<ModelType<Model>>): Promise<Array<InstanceType<Model>>>

  /**
   * Save or update model instance
   */
  save<T extends InstanceType<Model>>(model: T): Promise<T>
}

/**
 * ------------------------------------------------------
 * Helpers Interface
 * ------------------------------------------------------
 * - This a base helpers methods for model repositories
 */
interface Helpers<Model extends LucidModel> {
  /**
   * Fetch all rows with clauses and pagination
   */
  listWithPagination(params: PaginateParams<Model>): Promise<PaginateContractType<Model>>

  /**
   * Find one using a key-value pair
   */
  findBy(
    key: string,
    value: any,
    params?: ContextParams<Model>
  ): Promise<InstanceType<Model> | null>
}

/**
 * Types
 */
export type ModelType<Model extends LucidModel> = Partial<ModelAttributes<InstanceType<Model>>>

export type ModelKeysType<Model extends LucidModel> = keyof ModelType<Model>

export type PaginateContractType<Model extends LucidModel> =
  | ModelPaginatorContract<LucidRow & InstanceType<Model>>
  | SimplePaginatorContract<InstanceType<Model>>

/**
 * Interfaces
 */
export interface ContextParams<Model extends LucidModel> {
  clauses?: ModelClause<Model>
  orders?: Array<OrderBy<Model>>
  scopes?: <Scopes extends ExtractScopes<Model>>(scopes: Scopes) => void
}

export interface PaginateParams<Model extends LucidModel> extends ContextParams<Model> {
  page: number
  perPage: number
}

export interface ModelClause<Model extends LucidModel> {
  where?: ModelType<Model>
  like?: { column: ModelKeysType<Model>; match: string }
}

export interface OrderBy<Model extends LucidModel> {
  column: ModelKeysType<Model>
  direction?: 'asc' | 'desc'
}
