import {
  getGeneralConfig,
  getQueue,
  removePostFromQueue,
  getUtil,
  setUtil,
  addPostToHistory,
} from './database/DatabaseQueries';
import { uploadToImgur } from './utils/uploadToImgur';
import { publish } from './api/postContent';

async function uploadNewPost() {
  const mediaQueue = await getQueue();
  if (mediaQueue[0] === undefined) {
    console.log(
      'Cant upload to instagram because there is nothing on the queue :('
    );
    return;
  }
  const post = mediaQueue[0];
  let mediaLink = post.media;

  if (post.mediaType === 'IMAGE') {
    mediaLink = await uploadToImgur(post.media, 'IMAGE');
  }
  await new Promise((resolve) => setTimeout(resolve, 20000));

  const igLink = await publish(mediaLink, post.mediaType, post.caption);
  addPostToHistory(
    igLink,
    mediaLink,
    post.mediaType,
    post.owner,
    post.caption,
    new Date().toString()
  );

  console.log('Uploaded new post to Instagram!');
  removePostFromQueue(post.id);
}

export async function startPostingTask() {
  const postingDelay = (await getGeneralConfig()).upload_rate;
  const utils = await getUtil();

  const lastUploadDate = new Date(utils.last_upload_date);
  const nextPostDate = lastUploadDate;
  nextPostDate.setHours(nextPostDate.getHours() + postingDelay);

  if (nextPostDate <= lastUploadDate) {
    await uploadNewPost();
    await setUtil(
      new Date().toString(),
      utils.total_posted_medias + 1,
      utils.queued_medias - 1
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 300000));
  startPostingTask();
}

module.exports = {
  startPostingTask,
};
