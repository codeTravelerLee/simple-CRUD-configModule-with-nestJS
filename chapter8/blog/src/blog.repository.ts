import { Injectable } from '@nestjs/common';
import { PostDto } from './blog.model';
import { readFile, writeFile } from 'fs/promises';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './blog.schema';
import { Model } from 'mongoose';

export interface BlogRepository {
  getAllPosts(): Promise<PostDto[]>; //반환값은 Promise
  createPost(postDto: PostDto);
  getPost(id: String): Promise<PostDto | undefined | null>;
  deletePost(id: String);
  updatePost(id, postDto: PostDto);
}

//데이터를 로컬 파일에 저장하는 레포지토리
@Injectable()
export class BlogFileRepository implements BlogRepository {
  FILE_NAME = './src/blog.data.json';

  async getAllPosts(): Promise<PostDto[]> {
    const datas = await readFile(this.FILE_NAME, 'utf-8');
    const posts = JSON.parse(datas); //json > js객체
    return posts;
  }

  async createPost(postDto: PostDto) {
    const posts = await this.getAllPosts();
    const id = (posts.length + 1).toString();
    const createdPost = { ...postDto, createdDt: new Date() };
    posts.push(createdPost);
    await writeFile(this.FILE_NAME, JSON.stringify(posts));
  }

  async getPost(id: String): Promise<PostDto | undefined | null> {
    const posts = await this.getAllPosts();
    const result = posts.find((post) => post.id === id);
    return result;
  }

  async deletePost(id: String) {
    const posts = await this.getAllPosts();
    const filterdPosts = posts.filter((post) => post.id !== id);
    await writeFile(this.FILE_NAME, JSON.stringify(filterdPosts));
  }

  async updatePost(id: String, postDto: PostDto) {
    const posts = await this.getAllPosts();
    const index = posts.findIndex((post) => post.id === id);
    const updatedPost = { ...postDto, updatedDt: new Date() };
    posts[index] = updatedPost;
    await writeFile(this.FILE_NAME, JSON.stringify(posts));
  }
}

//데이터를 monogDB에 저장하는 레포지토리
@Injectable()
export class BlogMongoRepository implements BlogRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async getAllPosts(): Promise<Blog[]> {
    return await this.blogModel.find().exec();
  }

  async createPost(postDto: PostDto) {
    const createdPost = {
      ...postDto,
      createdDt: new Date(),
      updatedDt: new Date(),
    };

    this.blogModel.create(createdPost);
  }

  async getPost(id: string): Promise<PostDto | undefined | null> {
    return await this.blogModel.findById(id);
  }

  async deletePost(id: string) {
    await this.blogModel.findByIdAndDelete(id);
  }

  async updatePost(id: string, postDto: PostDto) {
    const updatedPost = { ...postDto, updatedDt: new Date() };
    await this.blogModel.findByIdAndUpdate(id, updatedPost);
  }
}
