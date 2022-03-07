import { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { Post } from 'main/models/Post';
import PostsPanel from './PostsPanel';

function ExplorePage() {
  const [posts, setPosts] = useState<Post[]>();

  useEffect(() => {
    let isMounted = true;
    if (posts === undefined || posts.length === 0)
      ipcRenderer.invoke('getPosts').then((data) => {
        if (isMounted) {
          setPosts(data);
        }
      });
    return () => {
      isMounted = false;
    };
  });

  ipcRenderer.on('updatePosts', (_ev, postsDB: Post[]) => {
    setPosts(postsDB);
  });

  return (
    <>
      <PostsPanel posts={posts} />
    </>
  );
}

export default ExplorePage;
