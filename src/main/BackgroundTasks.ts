import download from 'download';
import getRecentPosts from './api/getRecentPosts';
import {
  savePostFromHashtag,
  getPostFromIdJSON,
  getAllHashtagsToFetch,
} from './database/DatabaseQueries';
import { Post } from './models/Post';
import { addWatermark } from './utils/addWatermark';

const Status = require('./utils/Status');

async function saveMediaToStorage(
  original_url: string,
  media_type: string,
  media_id: string,
  username: string
) {
  if (media_type === 'IMAGE') {
    return addWatermark(original_url, media_id, username).then(
      (img_path: string) => img_path
    );
  }
  if (media_type === 'VIDEO') {
    return download(original_url, `./storage`, {
      filename: `${media_id}.mp4`,
    }).then(() => `./storage/${media_id}.mp4`);
  }
}

async function savePost(post: Post) {
  // eslint-disable-next-line max-len
  const path = await saveMediaToStorage(
    post.getMediaURL(),
    post.getMediaType(),
    post.getPostId(),
    post.getUsername()
  );
  post.setStoragePath(path);
  savePostFromHashtag(post);
}

async function saveAllPosts(posts: Post[]) {
  console.log('Now saving images or videos...');
  let total = 0;
  for (const post of posts) {
    const postFromDB = await getPostFromIdJSON(post.getPostId());
    if (postFromDB === undefined && post.getMediaURL() !== undefined) {
      await savePost(post);
      total++;
    }
    if (post.getMediaURL() === undefined) {
      console.log(`Skipped (${post.getPermalink()}). Maybe it is a reel.`);
    }
  }
  console.log(`Finished saving images and videos. (Total ${total})`);
}

async function startHashtagFetching(wait: boolean) {
  if (wait) {
    console.log('Waiting 20 minutes to fetch again.');
    await new Promise((resolve) => setTimeout(resolve, 1200000));
  }

  const hashtags: any = await getAllHashtagsToFetch();
  let allPosts: Post[] = [];
  for (const hashtag of hashtags) {
    const postsOfHashtag = await getRecentPosts
      .getRecentPosts(hashtag.hashtag)
      .finally(() => {
        console.log(`Finished fetching #${hashtag.hashtag}`);
      });
    allPosts = allPosts.concat(postsOfHashtag);
  }
  Status.setStatus('Saving posts');
  await saveAllPosts(allPosts);
  Status.setStatus('Idling...');
  startHashtagFetching(true);
}

module.exports = { startHashtagFetching };
