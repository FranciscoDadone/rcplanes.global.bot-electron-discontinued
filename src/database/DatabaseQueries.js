const DatabaseHandler = require('./DatabaseHandler')
const { Post } = require('../models/Post')

/**
 * Saves a post to the database.
 * @param {Post} post
 */
function savePostFromHashtag(post) {
  console.log('Saving post: ' + post.getPostId())
  const db = DatabaseHandler.getDatabase()

  db.run("INSERT INTO posts_from_hashtags (post_id, media_type, media_url, permalink, caption, children, hashtag, posted, date) VALUES (?,?,?,?,?,?,?,?,?)", [
    post.getPostId(),
    post.getMediaType(),
    post.getMediaURL(),
    post.getPermalink(),
    post.getCaption(),
    post.getChildren(),
    post.getHashtag(),
    post.isPosted(),
    post.getDate()
  ])
}

/**
 * Gets a post from the database.
 */
async function getPostFromId(id) {
  const db = DatabaseHandler.getDatabase()
  const sql = `SELECT * FROM posts_from_hashtags WHERE post_id=?;`;
  return new Promise((resolve, reject) => {
    db.all(sql, id, (err, rows) => {
      resolve(rows)
    })
  })
}


module.exports = { savePostFromHashtag, getPostFromId }
