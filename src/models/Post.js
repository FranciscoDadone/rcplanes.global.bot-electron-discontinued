class Post {
  post_id;
  media_type;
  caption;
  permalink;
  hashtag = '';
  posted = false;
  date;
  username;
  storage_path;
  children_of;
  media_url;

  constructor(post_id, media_type, storage_path, caption, permalink, hashtag, posted = false, date, username, children_of, media_url) {
    this.post_id      = post_id;
    this.media_type   = media_type;
    this.storage_path = storage_path;
    this.caption      = caption;
    this.permalink    = permalink;
    this.hashtag      = hashtag;
    this.posted       = posted;
    this.date         = date;
    this.username     = username;
    this.children_of  = children_of;
    this.media_url    = media_url;
  }

  getPostId() { return this.post_id; }
  getMediaType() { return this.media_type; }
  getStoragePath() { return this.storage_path; }
  getCaption() { return this.caption; }
  getPermalink() { return this.permalink; }
  getHashtag() { return this.hashtag; }
  isPosted() { return this.posted; }
  getDate() { return this.date; }
  getUsername() { return this.username; }
  getChildrenOf() { return this.children_of; }
  getMediaURL() { return this.media_url; }

  setStoragePath(path) { this.storage_path = path; }
}

module.exports = { Post };
