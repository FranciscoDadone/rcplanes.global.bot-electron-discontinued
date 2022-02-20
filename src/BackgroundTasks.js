const get_recent_hashtags = require('./api/get_recent_hashtags')
const { Post } = require('./models/Post')
const DatabaseQueries = require('./database/DatabaseQueries')
const DatabaseHandler = require('./database/DatabaseHandler')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchHashtag(hashtag) {
  DatabaseHandler.connect()
  await sleep(1000);

  get_recent_hashtags.getRecentPosts(hashtag).then(data => {
    (async () => {
      let i = 0;
      while(data[i] != undefined) {
        await DatabaseQueries.getPostFromId(data[i]['id']).then((post) => {
          dpost = data[i]
          if(post[0] == undefined) {
            DatabaseQueries.savePostFromHashtag(
              new Post(dpost['id'],
                       dpost['media_type'],
                       dpost['media_url'],
                       dpost['caption'],
                       dpost['permalink'],
                       dpost['children'],
                       'aeromodelismo',
                       false,
                       new Date().toLocaleDateString('en-GB'),
                       dpost['username']
                       ))
          }
        })
        i++;
      }
    })()


  })
}


function startHashtagFetching() {

  fetchHashtag('aeromodelismo')

}

module.exports = { startHashtagFetching }
