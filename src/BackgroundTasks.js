const get_recent_hashtags = require('./api/get_recent_hashtags')
const { Post } = require('./models/Post')
const DatabaseQueries = require('./database/DatabaseQueries')

async function fetchHashtag(hashtag) {
  console.log("Fetching hashtag: #" + hashtag)
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
                       hashtag,
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
  DatabaseQueries.getAllHashtagsToFetch().then(res => {
    for(let i = 0; i < Object.keys(res).length; i++) {
      fetchHashtag(res[i]['hashtag'])
    }
  })
}

module.exports = { startHashtagFetching }
