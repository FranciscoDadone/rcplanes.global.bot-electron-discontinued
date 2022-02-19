const sqlite3 = require('sqlite3').verbose();

let database;

function connect() {
    database = new sqlite3.Database('./src/database/database.sqlite', sqlite3.OPEN_READWRITE, (err) => {
        if (err && err.code == "SQLITE_CANTOPEN") {
          database = new sqlite3.Database('./src/database/database.sqlite', (err) => {
            if (err) {
              console.log("Database error " + err);
            }
            createTables();
        });
        } else if (err) {
          console.log("Database error: " + err);
        }
        console.log("Database connected!")
    });
    return database;
}

function close() {
    database.close()
    console.log("Database closed.")
  }

function getDatabase() {
    return database
  }

function createTables() {
    database.exec(`
    CREATE TABLE posts_from_hashtags (
      post_id     TEXT NOT NULL,
      hashtag     TEXT NOT NULL,
      media_type  TEXT NOT NULL,
      media_url   TEXT,
      permalink   TEXT NOT NULL,
      caption     TEXT,
      children    BLOB,
      posted      INTEGER
    );`);
  }

module.exports = { connect, getDatabase, close }
