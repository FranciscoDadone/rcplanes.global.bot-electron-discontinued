const download = require('download');
const getRecentHashtags = require('./api/getRecentHashtags');
const { Post } = require('./models/Post');
const DatabaseQueries = require('./database/DatabaseQueries');
const { addWatermark } = require('./utils/addWatermark');

async function saveMediaToStorage(original_url, media_type, media_id, username) {
  if (media_type === 'IMAGE') {
    return addWatermark(original_url, media_id, username).then((img_path) => {
      const ret = {
        path: img_path,
        media_type,
        media_id,
        username,
      };
      return ret;
    });
  } else if (media_type === 'VIDEO') {
    return download(original_url, './storage', { filename: `${media_id}.mp4` })
      .then(() => {
        const ret = {
          path: `./storage/${media_id}.mp4`,
          media_type,
          media_id,
          username,
        };
        return ret;
      });
  }
}

async function fetchHashtag(hashtag) {
  console.log(`Starting to fetch #${hashtag}`);
  return getRecentHashtags.getRecentPosts(hashtag).then((data) => (async () => {
    const postsToAdd = [];
    let i = 0;
    while (data[i] !== undefined) {
      // eslint-disable-next-line no-loop-func
      await DatabaseQueries.getPostFromId(data[i].id).then((post) => {
        const dpost = data[i];
        if (post[0] === undefined) {
          postsToAdd.push(dpost);
        }
      });
      i++;
    }

    await postsToAdd.map((post) => (async () => {
      if (post.media_type === 'CAROUSEL_ALBUM') {
        const album_lenght = Object.keys(post.children.data).length;

        for (let j = 0; j < album_lenght; j++) {
          const subPost = post.children.data[j];
          await saveMediaToStorage(
            subPost.media_url,
            subPost.media_type,
            subPost.id,
            post.username,
          ).then((savedMedia) => DatabaseQueries.savePostFromHashtag(
            new Post(
              subPost.id,
              subPost.media_type,
              savedMedia.path,
              post.caption,
              post.permalink,
              hashtag,
              false,
              new Date().toLocaleDateString('en-GB'),
              post.username,
              post.id,
            ),
          ));
        }
      } else {
        await saveMediaToStorage(
          post.media_url,
          post.media_type,
          post.id,
          post.username,
        ).then((savedMedia) => DatabaseQueries.savePostFromHashtag(
          new Post(
            post.id,
            post.media_type,
            savedMedia.path,
            post.caption,
            post.permalink,
            hashtag,
            false,
            new Date().toLocaleDateString('en-GB'),
            savedMedia.username,
            0,
          ),
        ));
      }
    })());
  })());
}

async function startHashtagFetching(wait) {
  if (wait) {
    console.log('Waiting 20 minutes to fetch again.');
    await new Promise((r) => setTimeout(r, 1200000));
  }
  console.log('Started hashtag fetching...');
  DatabaseQueries.getAllHashtagsToFetch().then(async (hashtags) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const hashtag of hashtags) {
      await fetchHashtag(hashtag.hashtag).finally(() => {
        console.log('Finished fetching that hashtag.');
      });
      await new Promise((r) => setTimeout(r, 60000));
    }
  });
}

module.exports = { startHashtagFetching };
