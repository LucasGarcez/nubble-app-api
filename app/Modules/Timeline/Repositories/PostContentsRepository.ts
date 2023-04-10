import { DateTime } from 'luxon'

import { IPostContent } from 'App/Modules/Timeline/Interfaces/IPostContent'
import PostContent from 'App/Modules/Timeline/Models/PostContent'

export default class PostContentsRepository implements IPostContent.Repository {
  public async create(timelineDTO: IPostContent.DTO.Store): Promise<PostContent> {
    return PostContent.create(timelineDTO)
  }

  public async show(timeline_category_id: string): Promise<PostContent | null> {
    return PostContent.findBy('id', timeline_category_id)
  }

  public async store(data: IPostContent.DTO.Store): Promise<PostContent> {
    return PostContent.create(data)
  }

  public async update(postContent: PostContent): Promise<PostContent> {
    return postContent.save()
  }

  /* ---------------------------- HELPERS ---------------------------- */

  public async findBy(findKey: string, findValue: any): Promise<PostContent | null> {
    return PostContent.findBy(findKey, findValue)
  }

  public async findOrCreate(
    searchPayload: IPostContent.DTO.Update,
    createPayload: IPostContent.DTO.Store
  ): Promise<PostContent | null> {
    return PostContent.firstOrCreate(searchPayload, createPayload)
  }

  public async deleteFromPost(
    postId: number,
    notDeleteIds: Array<any>
  ): Promise<PostContent[] | null> {
    return PostContent.query().where({ post_id: postId }).whereNotIn('id', notDeleteIds).update({
      is_deleted: true,
      deleted_at: DateTime.now(),
    })
  }

  /* ---- SETTERS ---- */

  /* ---- GETTERS ---- */

  /* ---- CHECKERS  ----*/
}
