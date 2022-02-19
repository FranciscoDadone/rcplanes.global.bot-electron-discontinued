const credentials = require("./private/credentials")
const { URLSearchParams } = require('url');
const fetch = require("node-fetch");


async function getHashtagId(hashtag) {
  console.log('Getting hashtag info...')
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
  getHashtagId(hashtag).then(id => {
    console.log(id)
  });
}

module.exports = { getRecentPosts }
