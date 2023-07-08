import 'App/Services/container'
import { injectable, inject } from 'tsyringe';
import { DateTime } from 'luxon';

import { PaginateContractType } from 'App/Shared/Interfaces/BaseInterface';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import DTOs = IPost.DTO;
import { IPost } from 'App/Interfaces/IPost';
import Post from 'App/Models/Post';

@injectable()
export default class UserServices {
  constructor(
    @inject('PostRepository')
    private postRepository: IPost.Repository
  ) { }

  public async list({
    page = 1,
    perPage = 10,
    search,
  }: DTOs.List): Promise<PaginateContractType<typeof Post>> {
    return this.postRepository.listWithPagination({
      page,
      perPage,
      scopes: (scopes) => {
        scopes.searchQueryScope(search);
        scopes.loadUser()
        scopes.likeCount()
        scopes.favoriteCount()
        scopes.commentCount()
        
      },
    });
  }

  public async get(id: string): Promise<Post> {
    const post = await this.postRepository.findBy('id', id);
    if (!post) throw new NotFoundException('Post not found or not available.');
    return post;
  }

  public async store(data: DTOs.Store): Promise<Post> {
    const { ...postDto } = data;

    const post = await this.postRepository.store(postDto);

    return post.refresh();
  }

  public async edit(id: string, data: any): Promise<Post> {
    const post = await this.postRepository.findBy('id', id);
    if (!post) throw new NotFoundException('Post not found or not available.');

    const { ...postDto } = data;

    post.merge(postDto);
    await this.postRepository.save(post);

    return post.refresh();
  }

  public async delete(id: string): Promise<void> {
    const post = await this.postRepository.findBy('id', id);
    if (!post) throw new NotFoundException('Post not found or not available.');

    post.merge({
      is_deleted: true,
      deleted_at: DateTime.now(),
    });
    await this.postRepository.save(post);
  }
}
