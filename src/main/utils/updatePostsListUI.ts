import { Post } from '../models/Post';
import { getAllNonDeletedPosts } from '../database/DatabaseQueries';

const showPostsIPC = require('./ipc/sendShowPosts');

export default function updatePostsListUI() {
  getAllNonDeletedPosts().then((postsDB: Post[]) => {
    let ret = postsDB;
    if (postsDB.length === 0) {
      ret = [new Post()];
    }
    showPostsIPC.sendShowPosts(ret);
  });
}
