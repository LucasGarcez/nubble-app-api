import { inject, injectable } from 'tsyringe'

import { IPost } from 'App/Modules/Timeline/Interfaces/IPost'
import { ITimelineCategory } from 'App/Modules/Timeline/Interfaces/ITimelineCategory'
import { ITimelineCategorySubscriber } from 'App/Modules/Timeline/Interfaces/ITimelineCategorySubscriber'
import Post from 'App/Modules/Timeline/Models/Post'

import DTO = IPost.DTO

@injectable()
export class StorePostWithoutHttpCtxService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPost.Repository,
    @inject('TimelineCategoriesRepository')
    private timelineCategoriesRepository: ITimelineCategory.Repository,
    @inject('TimelineCategorySubscriptionsRepository')
    public subscriptionsRepository: ITimelineCategorySubscriber.Repository
  ) {}

  public async execute(data: DTO.StoreWithContent): Promise<Post | null> {
    let postDto = data

    /***
     * attach timeline category to new post if it doesn't exist timeline category id
     */
    if (!postDto.timeline_category_id) {
      const defaultTimeline = await this.timelineCategoriesRepository.findBy('is_default', true, {
        clauses: { where: { hub_event_id: data.hub_event_id } },
      })

      if (defaultTimeline) postDto.timeline_category_id = defaultTimeline.id
    }

    const userId = data.user_id
    if (!userId) return null
    const post = await this.postsRepository.store({
      text: postDto.text,
      user_id: userId,
      hub_event_id: postDto.hub_event_id,
      timeline_category_id: postDto.timeline_category_id,
    })

    const contents = postDto.contents
    if (contents && contents.length > 0) {
      const contentsDto = contents.map((content, index) => {
        return { ...content, user_id: userId, order: index, hub_event_id: postDto.hub_event_id }
      })

      await this.postsRepository.createManyContents(contentsDto, post)
    }

    return (await this.postsRepository.findBy('id', post.id, {
      scopes: (scopes) => {
        scopes.loadContents()
        scopes.loadUser()
        scopes.reactionCount()
        scopes.messageCount()
        scopes.loadAlreadyReact(post.user_id)
      },
    }))!
  }
}
