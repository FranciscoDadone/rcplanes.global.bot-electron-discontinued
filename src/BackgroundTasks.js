const download = require('download');
const getRecentPosts = require('./api/getRecentPosts');
const DatabaseQueries = require('./database/DatabaseQueries');
const { addWatermark } = require('./utils/addWatermark');
const Status = require('./utils/Status');

async function saveMediaToStorage(original_url, media_type, media_id, username) {
  if (media_type === 'IMAGE') {
    return addWatermark(original_url, media_id, username).then((img_path) => img_path);
  } else if (media_type === 'VIDEO') {
    return download(original_url, './storage', { filename: `${media_id}.mp4` })
      .then(() => `./storage/${media_id}.mp4`);
  }
}

async function savePost(post) {
  // eslint-disable-next-line max-len
  const path = await saveMediaToStorage(post.getMediaURL(), post.getMediaType(), post.getPostId(), post.getUsername());
  post.setStoragePath(path);
  DatabaseQueries.savePostFromHashtag(post);
}

async function saveAllPosts(posts) {
  console.log('Now saving images or videos...');
  let total = 0;
  for (const post of posts) {
    const postFromDB = await DatabaseQueries.getPostFromIdJSON(post.getPostId());
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

async function startHashtagFetching(wait) {
  if (wait) {
    console.log('Waiting 20 minutes to fetch again.');
    await new Promise((r) => setTimeout(r, 1200000));
  }

  const hashtags = await DatabaseQueries.getAllHashtagsToFetch();
  let allPosts = [];
  for (const hashtag of hashtags) {
    const postsOfHashtag = await getRecentPosts.getRecentPosts(hashtag.hashtag).finally(() => {
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
