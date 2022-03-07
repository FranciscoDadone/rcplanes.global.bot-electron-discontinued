import { BrowserWindow } from 'electron';
import { Post } from 'main/models/Post';
import { getAllNonDeletedPosts } from '../../database/DatabaseQueries';

export async function updatePostsUI() {
  await getAllNonDeletedPosts().then((posts: Post[]) => {
    BrowserWindow.getAllWindows()[0].webContents.send('updatePosts', posts);
  });
}

module.exports = { updatePostsUI };
