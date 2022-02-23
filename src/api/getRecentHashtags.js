const { URLSearchParams } = require('url');
const fetch = require('node-fetch');
const credentials = require('./private/credentials');

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

    return (async () => {
      for (let i = 0; i < postsCount; i++) {
        const postPermalink = data1.data[i].permalink;
        try {
        /* eslint-disable no-await-in-loop */
          await fetch(`https://api.instagram.com/oembed/?url=${postPermalink}`, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }).then((data2) => {
            if (data2.status === 200) {
              data2.json().then((data2json) => {
                // eslint-disable-next-line no-param-reassign
                data1.data[i].username = data2json.author_name;
              });
            } else {
              // eslint-disable-next-line no-param-reassign
              data1.data[i].username = 'Unknown';
            }
          });
        } catch (err) {
        // eslint-disable-next-line no-param-reassign
          data1.data[i].username = 'Unknown';
          console.log(`Error on username: ${data1.data[i].id}`);
        }
      }
      return data1.data;
    })();
  })));
}

module.exports = { getRecentPosts };
