import { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { Post } from 'main/models/Post';
import PostsPanel from './PostsPanel';
import NewPostToast from './NewPostToast';
import FloatingToastContainer from './FloatingToastContainer';

function ExplorePage() {
  const [posts, setPosts] = useState<Post[]>();
  const [toast, setToast] = useState<string>();

  // Here it throws an error when you change between pages.

  useEffect(() => {
    let isMounted = true;
    if (posts === undefined || posts.length === 0)
      ipcRenderer.invoke('getPosts').then((data) => {
        if (isMounted) setPosts(data);
      });
    return () => {
      isMounted = false;
    };
  });

  ipcRenderer.on('updatePosts', (_ev, postsDB: Post[]) => {
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

export default ExplorePage;
