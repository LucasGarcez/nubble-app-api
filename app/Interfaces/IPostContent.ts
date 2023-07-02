import PostContent from 'App/Models/PostContent'

export namespace IPostContent {
  export interface Repository extends Helpers {
    create(timelineDTO: IPostContent.DTO.Store): Promise<PostContent>
  }

  export interface Helpers {
    findBy(indKey: string, findValue: any): Promise<PostContent | null>

    findOrCreate(
      searchPayload: IPostContent.DTO.Update,
      createPayload: IPostContent.DTO.Store
    ): Promise<PostContent | null>

    deleteFromPost(postId: number, notDeleteIds: Array<any>): Promise<PostContent[] | null>

    update(postContent: PostContent): Promise<PostContent>
  }

  export namespace DTO {
    export interface Store {
      content_url: string
      type: string
      user_id: number
      post_id?: number
      width?: number
      height?: number
      content_thumb_url?: string
      subtype?: string
      hub_event_id?: number
    }

    export interface Update {
      id?: number
      content_url?: string
      type?: string
      user_id?: number
      post_id?: number
      width?: number
      height?: number
      content_thumb_url?: string
      subtype?: string
      hub_event_id?: number
    }
  }
}
