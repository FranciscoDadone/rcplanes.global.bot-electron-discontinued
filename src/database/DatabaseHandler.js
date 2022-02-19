const sqlite3 = require('sqlite3').verbose();

function connect () {
  let db = new sqlite3.Database('./src/database/database.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connected!');
  });


}



module.exports = { connect }
