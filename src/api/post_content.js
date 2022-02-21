const credentials = require("./private/credentials")
const { URLSearchParams } = require('url');
const fetch = require("node-fetch");

async function createMediaObject(media_type, caption, url) {
  if(media_type == 'IMAGE') {
    console.log('Creating media object... (IMAGE)')
    const res = await fetch("https://graph.facebook.com/v12.0/" + credentials.ig_account_id + "/media?" + new URLSearchParams({
      caption: caption,
      access_token: credentials.access_token,
      image_url: url
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
  } else {
    console.log('Creating media object... (VIDEO)')
    const res = await fetch("https://graph.facebook.com/v12.0/" + credentials.ig_account_id + "/media?" + new URLSearchParams({
      caption: caption,
      media_type: 'VIDEO',
      access_token: credentials.access_token,
      video_url: url
    }), {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }});
    res.json().then(data => {
      console.log('Media object ID: ' + data['id'])
      function loopback() {
        checkStatus(data['id']).then(status => {
          (async () => {
            if(status != 'FINISHED') {
              await new Promise(r => setTimeout(r, 5000));
              loopback()
            } else {
              publish_media(data['id'])
            }
          })()
        })
      }
      loopback()
    });
  }
}

async function checkStatus(id) {
  return fetch('https://graph.facebook.com/v13.0/' + id + '?fields=status_code&access_token=' + credentials.access_token, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(res => res.json().then(data => {
    return data['status_code'];
  }))
}

async function publish_media(id) {
  const res = await fetch("https://graph.facebook.com/v13.0/" + credentials.ig_account_id + "/media_publish?" + new URLSearchParams({
    creation_id: id,
    access_token: credentials.access_token
  }), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }});
    res.json().then(data => {
      console.log('Media published! ' + data)
    });
}

const { Post } = require('../models/Post')
/**
 * Publish a post passed by param.
 * Make sure to edit the caption and url(image)
 * @param {Post} post
 */
function publish(post) {
    createMediaObject(post.getMediaType(), post.getCaption(), post.getMediaURL())
}

module.exports = { publish }
