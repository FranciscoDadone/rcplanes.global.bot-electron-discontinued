import URLSearchParams from 'url';
import { Post } from '../models/Post';

const fetch = require('node-fetch');
const credentials = require('./private/credentials');

async function getHashtagId(hashtag: string): Promise<any> {
  return new Promise((resolve) => {
    const res = fetch(
      `https://graph.facebook.com/v12.0/ig_hashtag_search?${new URLSearchParams.URLSearchParams(
        {
          user_id: credentials.ig_account_id,
          access_token: credentials.access_token,
          q: hashtag,
          fields: 'id,name',
        }
      )}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    res.then((data: any) =>
      data.json().then((data1: any) => {
        if (data.status === 400) {
          console.log(data1);
          resolve(data1);
        }
        return resolve(data1.data[0].id);
      })
    );
  });
}

async function getUsername(post: { permalink: any }): Promise<string> {
  return new Promise((resolve) => {
    fetch(`https://api.instagram.com/oembed/?url=${post.permalink}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((data2: { status: number; json: () => Promise<any> }) => {
      if (data2.status === 200) {
        return resolve(
          data2
            .json()
            .then((data2json: { author_name: any }) => data2json.author_name)
        );
      }
      return resolve('Unknown');
    });

    setTimeout(() => {
      resolve('Unknown');
    }, 5000);
  });
}

export async function getRecentPosts(hashtag: string): Promise<Post> {
  return getHashtagId(hashtag).then((id) =>
    fetch(
      `https://graph.facebook.com/v12.0/${id}/recent_media?${new URLSearchParams.URLSearchParams(
        {
          user_id: credentials.ig_account_id,
          access_token: credentials.access_token,
          fields:
            'id,children{media_url,media_type},caption,media_type,media_url,permalink',
        }
      )}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    ).then((data: { json: () => Promise<any> }) =>
      data.json().then((data1: { data: any[] }) => {
        const postsCount = Object.keys(data1.data).length;
        console.log(
          `Got ${postsCount} posts (unfiltered) from Instagram API #${hashtag}`
        );
        let actualPost: Post;
        return (async () => {
          const postsToReturn = [];
          for (let i = 0; i < postsCount; i++) {
            const post = data1.data[i];
            const username = await getUsername(post);

            if (post.media_type === 'CAROUSEL_ALBUM') {
              // eslint-disable-next-line no-restricted-syntax
              for (const children of post.children.data) {
                actualPost = new Post(
                  children.id,
                  children.media_type,
                  '',
                  post.caption,
                  post.permalink,
                  hashtag,
                  false,
                  new Date().toLocaleDateString('en-GB'),
                  username,
                  post.id,
                  children.media_url
                );
                postsToReturn.push(actualPost);
              }
            } else {
              actualPost = new Post(
                post.id,
                post.media_type,
                '',
                post.caption,
                post.permalink,
                hashtag,
                false,
                new Date().toLocaleDateString('en-GB'),
                username,
                '0',
                post.media_url
              );
              postsToReturn.push(actualPost);
            }
          }
          return postsToReturn;
        })();
      })
    )
  );
}

module.exports = { getRecentPosts };
