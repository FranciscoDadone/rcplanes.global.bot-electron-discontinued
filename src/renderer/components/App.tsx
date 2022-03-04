import { useState } from 'react';
import { ipcRenderer } from 'electron';
import '../../../assets/css/App.css';
import { Post } from 'main/models/Post';
import AppNavbar from './AppNavbar';
import PostsPanel from './PostsPanel';
import NewPostToast from './NewPostToast';
import FloatingToastContainer from './FloatingToastContainer';

function App() {
  const [posts, setPosts] = useState<Post[]>();
  const [toast, setToast] = useState<string>();

  ipcRenderer.on('showPosts', (_ev, postsDB: Post[]) => {
    setPosts(postsDB);
  });

  ipcRenderer.on('showNewPostToast', (_ev, postId) => {
    setToast(postId);
  });

  return (
    <>
      <AppNavbar />
      <PostsPanel posts={posts} />
      <FloatingToastContainer>
        <NewPostToast postId={toast} />
      </FloatingToastContainer>
    </>
  );
}

export default App;
