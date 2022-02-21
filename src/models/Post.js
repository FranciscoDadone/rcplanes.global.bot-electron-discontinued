class Post {
  post_id;
  media_type;
  caption;
  permalink;
  children;
  hashtag = '';
  posted = false;
  date;
  username;
  storage_path;

  constructor(post_id, media_type, storage_path, caption, permalink, children, hashtag, posted = false, date, username) {
    this.post_id     = post_id;
    this.media_type  = media_type;
    this.storage_path   = storage_path;
    this.caption     = caption;
    this.permalink   = permalink;
    this.children    = children;
    this.hashtag     = hashtag;
    this.posted      = posted;
    this.date        = date;
    this.username    = username;
  }

  getPostId() { return this.post_id }
  getMediaType() { return this.media_type }
  getStoragePath() { return this.storage_path }
  getCaption() { return this.caption }
  getPermalink() { return this.permalink }
  getChildren() { return this.children }
  getHashtag() { return this.hashtag }
  isPosted() { return this.posted }
  getDate() { return this.date }
  getUsername() { return this.username }

}

module.exports = { Post }
