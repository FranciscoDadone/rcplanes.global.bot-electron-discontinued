const get_recent_hashtags = require('./api/get_recent_hashtags')
const { Post } = require('./models/Post')
const DatabaseQueries = require('./database/DatabaseQueries')
const { addWatermark } = require('./../utils/addWatermark')
const download = require('download');

async function saveMediaToStorage(original_url, media_type, media_id, username) {
  if(media_type == 'IMAGE') {
    return addWatermark(original_url, media_id, username).then(img_path => {
      return {
        path: img_path,
        media_type: media_type,
        media_id: media_id
      };
    })
  } else if(media_type == 'VIDEO') {
    return download(original_url, "./storage", { filename: media_id + ".mp4" })
    .then((file) => {
      return {
          path: './storage/' + media_id + ".mp4",
          media_type: media_type,
          media_id: media_id
        }
    })
  } else if(media_type == 'CAROUSEL_ALBUM') {
    return {
      path: '',
      media_type: media_type,
      media_id: media_id
    }
  }
}

async function fetchHashtag(hashtag) {
  get_recent_hashtags.getRecentPosts(hashtag).then(data => {
    (async () => {

      let postsToAdd = []

      let i = 0;
      while(data[i] != undefined) {
        await DatabaseQueries.getPostFromId(data[i]['id']).then((post) => {
          dpost = data[i]
            if(post[0] == undefined) {
              postsToAdd.push(dpost)
            }
          i++;
        })
      }


      postsToAdd.map(post => {
        (async () => {
          await saveMediaToStorage(post['media_url'], post['media_type'], post['id'], post['username']).then(savedMedia => {
            DatabaseQueries.savePostFromHashtag(
              new Post(post['id'],
                       post['media_type'],
                       savedMedia['path'],
                       post['caption'],
                       post['permalink'],
                       post['children'],
                       hashtag,
                       false,
                       new Date().toLocaleDateString('en-GB'),
                       post['username']
                       )
                      )
                    })
        })()
      })



    })()
  })
}

async function startHashtagFetching() {
  console.log('Started hashtag fetching...')
  DatabaseQueries.getAllHashtagsToFetch().then(res => {
    for(let i = 0; i < Object.keys(res).length; i++) {
      fetchHashtag(res[i]['hashtag'])
    }
  })
  await new Promise(r => setTimeout(r, 600000));
  startHashtagFetching();
}

module.exports = { startHashtagFetching }
