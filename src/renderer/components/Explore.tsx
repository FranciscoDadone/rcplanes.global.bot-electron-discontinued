import { useState } from 'react';
import { ipcRenderer } from 'electron';
import { Post } from 'main/models/Post';
import PostsPanel from './PostsPanel';
import NewPostToast from './NewPostToast';
import FloatingToastContainer from './FloatingToastContainer';

function Explore() {
  const [posts, setPosts] = useState<Post[]>();
  const [toast, setToast] = useState<string>();

  // Here it throws an error when you change between pages.
  if (posts === undefined || posts.length === 0) ipcRenderer.invoke('getPosts');

  ipcRenderer.on('showPosts', (_ev, postsDB: Post[]) => {
    setPosts(postsDB);
  });

  ipcRenderer.on('showNewPostToast', (_ev, postId) => {
    setToast(postId);
  });
  return (
    <>
      <PostsPanel posts={posts} />
      <FloatingToastContainer>
        <NewPostToast postId={toast} />
      </FloatingToastContainer>
    </>
  );
}

export default Explore;
