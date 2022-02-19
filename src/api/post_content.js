const credentials = require("./private/credentials")
const { URLSearchParams } = require('url');
const fetch = require("node-fetch");

async function createMediaObject(caption, img_url) {
  console.log('Creating media object...')
  const res = await fetch("https://graph.facebook.com/v12.0/" + credentials.ig_account_id + "/media?" + new URLSearchParams({
    caption: caption,
    access_token: credentials.access_token,
    image_url: img_url
  }), {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }});
  res.json().then(data => {
    console.log('Media object ID: ' + data['id'])
    publish_media(data['id']);
  });

}

async function publish_media(id) {
  const res = await fetch("https://graph.facebook.com/v12.0/" + credentials.ig_account_id + "/media_publish?" + new URLSearchParams({
    creation_id: id,
    access_token: credentials.access_token
  }), {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }});
    res.json().then(data => {
      console.log('Media published! ' + data)
    });
}

function publish() {
    createMediaObject()
}

module.exports = { publish }
