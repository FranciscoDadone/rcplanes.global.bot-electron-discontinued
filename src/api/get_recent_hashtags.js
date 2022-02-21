const credentials = require("./private/credentials")
const { URLSearchParams } = require('url');
const fetch = require("node-fetch");


async function getHashtagId(hashtag) {
  return fetch("https://graph.facebook.com/v12.0/ig_hashtag_search?" + new URLSearchParams({
    user_id: credentials.ig_account_id,
    access_token: credentials.access_token,
    q: hashtag,
    fields: 'id,name'
  }), {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }}).then(data => data.json().then(data1 => {
    console.log('Hashtag id: ' + data1['data'][0]['id'])
    return data1['data'][0]['id']
  }));
}

async function getRecentPosts(hashtag) {
  return getHashtagId(hashtag).then(id => {
    return fetch("https://graph.facebook.com/v12.0/" + id + "/recent_media?" + new URLSearchParams({
      user_id: credentials.ig_account_id,
      access_token: credentials.access_token,
      fields: 'id,children{media_url},caption,media_type,media_url,permalink'
    }), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }}).then(data => data.json().then(data1 => {
      const posts_count = Object.keys(data1['data']).length;

      return (async () => {
        for(let i = 0; i < posts_count; i++) {
          const post_permalink = data1['data'][i]['permalink']
          await fetch('https://api.instagram.com/oembed/?url=' + post_permalink, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }}).then(data2 => data2.json().then(data2json => {
              data1['data'][i]['username'] = data2json['author_name']
            }))
        }
        return data1['data']
      })()

    }));
  });
}

module.exports = { getRecentPosts }
