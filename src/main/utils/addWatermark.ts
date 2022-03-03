const Jimp = require('jimp');

export async function addWatermark(
  image_url: string,
  filename: string,
  username: string
) {
  if (username === undefined) return;
  const image = await Jimp.read({
    url: image_url,
  });

  return Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then((font: any) =>
    (async () => {
      image.resize(1280, Jimp.AUTO);

      const watermark = await Jimp.read(
        `${__dirname}/../../../assets/images/watermark.png`
      );

      const watermarkWidth = 500;
      const imageWidth = image.getWidth();
      const imageHeight = image.getHeight();

      const finalWidth =
        watermarkWidth * ((watermarkWidth * 100) / imageWidth) * 0.02;
      watermark.resize(finalWidth, Jimp.AUTO);
      const finalHeight = watermark.getHeight();

      watermark.print(font, 100, finalHeight - 40, username);

      image.blit(watermark, 10, imageHeight - finalHeight - 10);

      const path = `./storage/${filename}.png`;
      await image.writeAsync(path);
      return `${filename}.png`;
    })()
  );
}

module.exports = {
  addWatermark,
};
