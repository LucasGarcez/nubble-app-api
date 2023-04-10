import { DateTime } from 'luxon'

import { IPostContent } from 'App/Modules/Timeline/Interfaces/IPostContent'
import Post from 'App/Modules/Timeline/Models/Post'
import PostContent from 'App/Modules/Timeline/Models/PostContent'
import IBaseRepository, { OrderBy } from 'App/Shared/Interfaces/IBaseRepository'

export namespace IPost {
  export interface Repository extends IBaseRepository<typeof Post> {
    createManyContents(
      contents: Array<IPostContent.DTO.Store>,
      post: Post
    ): Promise<PostContent[] | null>

    getMoreInteractedPosts(params: DTO.MoreInteractedParams): Promise<Array<Post>>

    getPostCountBetweenDate(startDate: Date | string, endDate: Date | string): Promise<number>
  }

  export namespace DTO {
    export interface List {
      page: number
      perPage: number
      search?: string
      userId?: number
      admin?: boolean
      timelineCategoryId?: number
      partnerId?: number
      startDate?: DateTime
      endDate?: DateTime
      order?: OrderBy<typeof Post>
      hub_event_id?: number
    }

    export interface Get {
      postId: number | string
      userId?: number | string
    }

    export interface Store {
      text?: string
      user_id?: number
      timeline_category_id?: number
      partner_ids?: Array<number>
      send_notification?: boolean
      schedule_date?: DateTime
      is_fixed?: boolean
      fixed_date?: DateTime
      is_activated?: boolean
      hub_event_id?: number
    }

    export interface StoreWithContent {
      text?: string
      user_id?: number
      timeline_category_id?: number
      partner_ids?: Array<number>
      partner_id?: number
      send_notification?: boolean
      schedule_date?: DateTime
      is_fixed?: boolean
      fixed_date?: DateTime
      is_activated?: boolean
      hub_event_id?: number
      contents?: Array<{
        content_url: string
        type: string
        content_thumb_url?: string
        width?: number
        height?: number
        subtype?: string
      }>
    }

    export interface UpdateWithContent {
      text?: string
      user_id?: number
      partner_ids?: Array<number>
      send_notification?: boolean
      schedule_date?: DateTime
      is_fixed?: boolean
      fixed_date?: DateTime
      is_activated?: boolean
      hub_event_id?: number
      contents?: Array<{
        id?: number
        content_url: string
        type: string
      }>
    }

    export interface ChartParams {
      startDate: DateTime
      endDate: DateTime
      granularity: string
    }

    export interface ChartReturn {
      total_count: number
      new_count: number
      chart: Array<{ date_time: string; count: string }>
    }

    export interface MoreInteractedParams {
      startDate: DateTime
      endDate: DateTime
    }
  }
}
