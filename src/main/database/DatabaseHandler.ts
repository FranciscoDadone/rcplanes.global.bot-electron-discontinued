const sqlite3 = require('sqlite3');
sqlite3.verbose();

let database: sqlite3.Database;

export function close() {
  database.close();
  console.log('Database closed.');
}

export function getDatabase() {
  return database;
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
      posted       INTEGER,
      username     TEXT NOT NULL
    );`);

  // hashtags_to_fetch
  database.exec(`CREATE TABLE hashtags_to_fetch (
                    hashtag TEXT NOT NULL,
                    banned_users TEXT);`);

  const sql = 'INSERT INTO hashtags_to_fetch (hashtag) VALUES (?)';
  database.run(sql, ['aeromodelismo']);
  database.run(sql, ['rcplanes']);
  database.run(sql, ['rcplaneshow']);
  database.run(sql, ['rcfly']);
}

export function connect() {
  database = new sqlite3.Database(`${__dirname}/database.sqlite`, sqlite3.OPEN_READWRITE, (err) => {
    if (err && err.code === 'SQLITE_CANTOPEN') {
      database = new sqlite3.Database(`${__dirname}/database.sqlite`, (err1) => {
        if (err1) {
          console.log(`Database error ${err1}`);
        }
        createTables();
      });
    } else if (err) {
      console.log(`Database error ${err}`);
    }
    console.log('Database connected!');
  });
  //   database.on('trace', (err) => {
  //     console.log(err);
  //   });
  return database;
}

module.exports = { connect, getDatabase, close };
