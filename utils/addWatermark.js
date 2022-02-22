const Jimp = require('jimp');

async function addWatermark(image_url, filename, username) {
  if(username == undefined) return;
   const image = await Jimp.read({
      url: image_url
   });

  return Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(font => {
    return (async () => {
      image.resize(1280, Jimp.AUTO)

      const watermark = await Jimp.read('./src/assets/images/watermark.png');

      const watermark_width  = 500;
      const image_width      = image.getWidth()
      const image_height     = image.getHeight()

      const final_w = (watermark_width  * ((watermark_width * 100) / image_width)) * 0.02;
      watermark.resize(final_w, Jimp.AUTO);
      const final_h = watermark.getHeight();

      watermark.print(font, 100, final_h - 40, username)

      image.blit(watermark, 10, image_height - final_h - 10)

      const path = './storage/' + filename + ".png";
      await image.writeAsync(path)
      return path
    })()
  });

}

module.exports = {
  addWatermark
}
