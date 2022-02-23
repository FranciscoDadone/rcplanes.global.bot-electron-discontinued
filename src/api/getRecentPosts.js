const { URLSearchParams } = require('url');
const fetch = require('node-fetch');
const credentials = require('./private/credentials');
const { Post } = require('../models/Post');

async function getHashtagId(hashtag) {
  return fetch(`https://graph.facebook.com/v12.0/ig_hashtag_search?${new URLSearchParams({
    user_id: credentials.ig_account_id,
    access_token: credentials.access_token,
    q: hashtag,
    fields: 'id,name',
  })}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then((data) => data.json().then((data1) => data1.data[0].id));
}

async function getUsername(post) {
  return fetch(`https://api.instagram.com/oembed/?url=${post.permalink}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then((data2) => {
    if (data2.status === 200) {
      return data2.json().then((data2json) => data2json.author_name);
    } else {
      return 'Unknown';
    }
  });
}

async function getRecentPosts(hashtag) {
  return getHashtagId(hashtag).then((id) => fetch(`https://graph.facebook.com/v12.0/${id}/recent_media?${new URLSearchParams({
    user_id: credentials.ig_account_id,
    access_token: credentials.access_token,
    fields: 'id,children{media_url,media_type},caption,media_type,media_url,permalink',
  })}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then((data) => data.json().then((data1) => {
    const postsCount = Object.keys(data1.data).length;
    console.log(`Got ${postsCount} posts (unfiltered) from Instagram API #${hashtag}`);
    return (async () => {
      const postsToReturn = [];
      for (let i = 0; i < postsCount; i++) {
        const post = data1.data[i];
        const username = await getUsername(post);

        if (post.media_type === 'CAROUSEL_ALBUM') {
          // eslint-disable-next-line no-restricted-syntax
          for (const children of post.children.data) {
            postsToReturn.push(new Post(
              children.id,
              children.media_type,
              undefined,
              post.caption,
              post.permalink,
              hashtag,
              false,
              new Date().toLocaleDateString('en-GB'),
              username,
              post.id,
              children.media_url,
            ));
          }
        } else {
          postsToReturn.push(new Post(
            post.id,
            post.media_type,
            undefined,
            post.caption,
            post.permalink,
            hashtag,
            false,
            new Date().toLocaleDateString('en-GB'),
            username,
            0,
            post.media_url,
          ));
        }
      }
      return postsToReturn;
    })();
  })));
}

module.exports = { getRecentPosts };
