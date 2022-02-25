import { useState } from 'react';
import { ipcRenderer } from 'electron';
import '../../../assets/css/App.css';
import { Post } from 'main/models/Post';
import AppNavbar from './AppNavbar';
import PostsPanel from './PostsPanel';

function App() {
  const [posts, setPosts] = useState<Post[]>();

  ipcRenderer.on('showPosts', (_ev, postsDB: Post[]) => {
    setPosts(postsDB);
  });

  return (
    <>
      <AppNavbar />
      <PostsPanel posts={posts} />
    </>
  );
}

export default App;
