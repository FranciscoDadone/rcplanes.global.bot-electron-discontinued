import sqlite3 from 'sqlite3';

sqlite3.verbose();
let database: sqlite3.Database;

export function close() {
  database.close();
  console.log('Database closed.');
}

function createTables() {
  // posts_from_hashtags
  // sto: NOT NULL UNIQUE
  database.exec(`
    CREATE TABLE posts_from_hashtags (
      date         TEXT,
      post_id      TEXT NOT NULL UNIQUE,
      hashtag      TEXT NOT NULL,
      media_type   TEXT NOT NULL,
      storage_path TEXT NOT NULL UNIQUE,
      permalink    TEXT NOT NULL,
      caption      TEXT,
      children_of  INTEGER,
      status       TEXT,
      username     TEXT NOT NULL
    );`);

  // hashtags_to_fetch
  database.exec(`CREATE TABLE hashtags_to_fetch (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                hashtag TEXT NOT NULL);`);

  const sql = 'INSERT INTO hashtags_to_fetch (hashtag) VALUES (?)';
  database.run(sql, ['aeromodelismo']);
  database.run(sql, ['rcplanes']);

  // media_queue
  database.exec(`CREATE TABLE media_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    media TEXT NOT NULL,
    mediaType TEXT NOT NULL,
    caption TEXT,
    owner TEXT NOT NULL);`);

  // credentials
  database.exec(`CREATE TABLE credentials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    access_token TEXT NOT NULL,
    client_secret TEXT NOT NULL,
    client_id TEXT NOT NULL,
    ig_account_id TEXT NOT NULL);`);

  database.run(
    'INSERT INTO credentials (access_token, client_secret, client_id, ig_account_id) VALUES ("null","","","");'
  );

  // general_config
  database.exec(`CREATE TABLE general_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    upload_rate NUMBER NOT NULL,
    description_boilerplate TEXT NOT NULL,
    hashtag_fetching_enabled INTEGER NOT NULL);`);

  database.run(
    'INSERT INTO general_config (upload_rate, description_boilerplate, hashtag_fetching_enabled) VALUES (3, "%description%", true);'
  );

  // util
  database.exec(`CREATE TABLE util (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    last_upload_date TEXT NOT NULL,
    total_posted_medias NUMBER NOT NULL,
    queued_medias NUMBER NOT NULL);`);

  database.run(
    `INSERT INTO util (last_upload_date, total_posted_medias, queued_medias) VALUES ('${new Date().toString()}', 0, 0);`
  );

  // posted_medias
  database.exec(`CREATE TABLE posted_medias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ig_link TEXT NOT NULL,
    imgur_link TEXT NOT NULL,
    media_type TEXT NOT NULL,
    owner TEXT NOT NULL,
    caption TEXT NOT NULL,
    date TEXT NOT NULL);`);
}

export function connect(): sqlite3.Database {
  database = new sqlite3.Database(
    `${__dirname}/database.sqlite`,
    sqlite3.OPEN_READWRITE,
    (err: Error | null) => {
      if (err) {
        database = new sqlite3.Database(
          `${__dirname}/database.sqlite`,
          (err1) => {
            if (err1) {
              console.log(`Database error ${err1}`);
            }
            createTables();
          }
        );
      } else if (err) {
        console.log(`Database error ${err}`);
      }
      console.log('Database connected!');
    }
  );
  // database.on('trace', (err) => {
  //   console.log(err);
  // });
  return database;
}

export function getDatabase(): sqlite3.Database {
  return database;
}

module.exports = { connect, getDatabase, close };
