import { Post } from "main/models/Post";

const DatabaseHandler = require('./DatabaseHandler');

/**
 * Saves a post to the database.
 * @param {Post} post
 */
export function savePostFromHashtag(post: Post) {
  console.log(`Saving (${post.getMediaType()}): ${post.getPostId()} (#${post.getHashtag()})`);
  const db = DatabaseHandler.getDatabase();

  try {
    db.run('INSERT INTO posts_from_hashtags (post_id, media_type, storage_path, permalink, caption, children_of, hashtag, posted, date, username) VALUES (?,?,?,?,?,?,?,?,?,?)', [
      post.getPostId(),
      post.getMediaType(),
      post.getStoragePath(),
      post.getPermalink(),
      post.getCaption(),
      post.getChildrenOf(),
      post.getHashtag(),
      post.isPosted(),
      post.getDate(),
      post.getUsername(),
    ]);
  } catch (e) {
    console.error(e);
  }
}

/**
 * Gets a post from the database.
 */
export async function getPostFromIdJSON(id: string) {
  const db = DatabaseHandler.getDatabase();
  const sql = 'SELECT * FROM posts_from_hashtags WHERE (post_id=? OR children_of=?);';
  return new Promise((resolve) => {
    db.all(sql, [id, id], (_err: any, rows: any) => {
      if (Object.keys(rows).length === 0) resolve(undefined);
      else resolve(rows);
    });
  });
}

export async function addHashtagToFetch(hashtag: string) {
  const db = DatabaseHandler.getDatabase();
  const sql = 'INSERT INTO hashtags_to_fetch (hashtag) VALUES (?)';
  db.run(sql, [
    hashtag,
  ]);
}

export async function getAllHashtagsToFetch(): Promise<{ [key: string]: any[] }> {
  const db = DatabaseHandler.getDatabase();
  const sql = 'SELECT * FROM hashtags_to_fetch;';
  return new Promise((resolve) => {
    db.all(sql, (_err: any, rows: any) => {
      resolve(rows);
    });
  });
}

module.exports = {
  savePostFromHashtag,
  getPostFromIdJSON,
  addHashtagToFetch,
  getAllHashtagsToFetch,
};
