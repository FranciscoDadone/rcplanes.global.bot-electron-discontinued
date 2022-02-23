const fs = require('fs');
const { ImgurClient } = require('imgur');

function upload(path) {
  const client = new ImgurClient({ clientId: '3246fe4bdf4e7ef' });
  return client.upload({
    image: fs.createReadStream(path),
    title: '',
    description: '',
    type: 'stream',
  }).then((data) => data.data.link);
}

module.exports = { upload };
