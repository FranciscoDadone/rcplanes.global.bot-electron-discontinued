import { getCredentials } from 'main/database/DatabaseQueries';
import { Post } from 'main/models/Post';

const { URLSearchParams } = require('url');
const fetch = require('node-fetch');

async function checkStatus(id: string) {
  const credentials: any = await getCredentials();
  return fetch(
    `https://graph.facebook.com/v13.0/${id}?fields=status_code&access_token=${credentials.access_token}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  ).then((res: any) => res.json().then((data: any) => data.status_code));
}

async function publishMedia(id: string) {
  const credentials: any = await getCredentials();
  const res = await fetch(
    `https://graph.facebook.com/v13.0/${
      credentials.ig_account_id
    }/media_publish?${new URLSearchParams({
      creation_id: id,
      access_token: credentials.access_token,
    })}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    }
  );
  res.json().then((data: string) => {
    console.log(`Media published! ${data}`);
  });
}
async function createMediaObject(
  media_type: string,
  caption: string,
  url: string
) {
  const credentials: any = await getCredentials();
  if (media_type === 'IMAGE') {
    console.log('Creating media object... (IMAGE)');
    const res = await fetch(
      `https://graph.facebook.com/v12.0/${
        credentials.ig_account_id
      }/media?${new URLSearchParams({
        caption,
        access_token: credentials.access_token,
        image_url: url,
      })}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    res.json().then((data: any) => {
      console.log(`Media object ID: ${data.id}`);
      publishMedia(data.id);
    });
  } else {
    console.log('Creating media object... (VIDEO)');
    const res = await fetch(
      `https://graph.facebook.com/v12.0/${
        credentials.ig_account_id
      }/media?${new URLSearchParams({
        caption,
        media_type: 'VIDEO',
        access_token: credentials.access_token,
        video_url: url,
      })}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    res.json().then((data: any) => {
      console.log(`Media object ID: ${data.id}`);
      function loopback() {
        checkStatus(data.id).then((status) => {
          (async () => {
            if (status !== 'FINISHED') {
              await new Promise((resolve) => setTimeout(resolve, 5000));
              loopback();
            } else {
              publishMedia(data.id);
            }
          })();
        });
      }
      loopback();
    });
  }
}

/**
 * Publish a post passed by param.
 * Make sure to edit the caption and url(image)
 * @param {Post} post
 */
function publish(post: Post) {
  createMediaObject(post.getMediaType(), post.getCaption(), post.getMediaURL());
}

module.exports = { publish };
