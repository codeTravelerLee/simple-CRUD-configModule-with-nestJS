import { Injectable } from '@nestjs/common';
import { PostDto } from './blog.model';
import { BlogMongoRepository } from './blog.repository';

@Injectable()
export class BlogService {
  private blogRepository: BlogMongoRepository;
  constructor(blogRepository: BlogMongoRepository) {
    this.blogRepository = blogRepository;
  }

  async getAllPosts() {
    return await this.blogRepository.getAllPosts();
  }

  createPost(postDto: PostDto) {
    this.blogRepository.createPost(postDto);
  }

  async getPost(id) {
    return await this.blogRepository.getPost(id);
  }

  deletePost(id) {
    this.blogRepository.deletePost(id);
  }

  async updatePost(id, postDto: PostDto) {
    return await this.blogRepository.updatePost(id, postDto);
  }
}
