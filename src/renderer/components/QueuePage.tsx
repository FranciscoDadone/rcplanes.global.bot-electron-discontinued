import { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { Button, Table } from 'react-bootstrap';
import {
  faArrowDownLong,
  faArrowUpLong,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Media from './Media';
import '../../../assets/css/QueuePage.css';

function QueuePage() {
  const [queuedPosts, setQueuedPosts] = useState<
    [
      {
        id: number;
        caption: string;
        media: string;
        mediaType: string;
        owner: string;
      }
    ]
  >([
    {
      id: 0,
      caption: '',
      media: '',
      mediaType: '',
      owner: '',
    },
  ]);

  useEffect(() => {
    let isMounted = true;
    if (queuedPosts === undefined || queuedPosts[0].mediaType === '') {
      ipcRenderer.invoke('getQueue').then((data) => {
        if (isMounted) {
          setQueuedPosts(data);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [queuedPosts]);

  if (queuedPosts[0].owner === '') {
    return (
      <div className="black-bg">
        <h1 className="loading-tag">Loading content...</h1>
      </div>
    );
  }

  const handleUp = (post: {
    id: number;
    caption: string;
    media: string;
    mediaType: string;
    owner: string;
  }) => {
    const arr: any = [];
    let index = 0;
    for (let i = 0; i < queuedPosts.length; i++) {
      if (post === queuedPosts[i]) {
        index = i;
      }
      arr.push(queuedPosts[i]);
    }
    if (index - 1 < 0) return;
    const aux = arr[index];
    arr[index] = {
      id: arr[index].id,
      caption: arr[index - 1].caption,
      media: arr[index - 1].media,
      mediaType: arr[index - 1].mediaType,
      owner: arr[index - 1].owner,
    };
    arr[index - 1] = {
      id: arr[index - 1].id,
      caption: aux.caption,
      media: aux.media,
      mediaType: aux.mediaType,
      owner: aux.owner,
    };

    setQueuedPosts(arr);
    ipcRenderer.send('updateQueue', {
      r1: queuedPosts[index],
      r2: queuedPosts[index - 1],
    });
  };

  const handleDown = (post: {
    id: number;
    caption: string;
    media: string;
    mediaType: string;
    owner: string;
  }) => {
    const arr: any = [];
    let index = 0;
    for (let i = 0; i < queuedPosts.length; i++) {
      if (post === queuedPosts[i]) {
        index = i;
      }
      arr.push(queuedPosts[i]);
    }
    if (index + 1 >= queuedPosts.length) return;
    const aux = arr[index];
    arr[index] = {
      id: arr[index].id,
      caption: arr[index + 1].caption,
      media: arr[index + 1].media,
      mediaType: arr[index + 1].mediaType,
      owner: arr[index + 1].owner,
    };
    arr[index + 1] = {
      id: arr[index + 1].id,
      caption: aux.caption,
      media: aux.media,
      mediaType: aux.mediaType,
      owner: aux.owner,
    };

    setQueuedPosts(arr);
    ipcRenderer.send('updateQueue', {
      r1: queuedPosts[index],
      r2: queuedPosts[index + 1],
    });
  };

  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>&nbsp;</th>
          <th>#</th>
          <th>Preview</th>
          <th>Id</th>
          <th>Owner</th>
          <th>Media Type</th>
          <th>Caption</th>
          <th>&nbsp;</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {queuedPosts?.map((post, index) => (
          <tr key={post.id}>
            <td>&nbsp;</td>
            <td>{index}</td>
            <td className="media-container">
              <Media
                mediaType={post.mediaType}
                media={post.media}
                autoplay={false}
                imageWidth="20%"
                imageMinWidth="10vw"
                videoWidth="20%"
                videoMinWidth="10vw"
              />
            </td>
            <td className="vertical-middle">{post.id}</td>
            <td className="vertical-middle">{post.owner}</td>
            <td className="vertical-middle">{post.mediaType}</td>
            <td>{post.caption}</td>
            <th className="vertical-middle">
              <Button variant="primary" onClick={() => handleUp(post)}>
                <FontAwesomeIcon icon={faArrowUpLong} />
              </Button>
              <Button variant="primary" onClick={() => handleDown(post)}>
                <FontAwesomeIcon icon={faArrowDownLong} />
              </Button>
            </th>
            <th className="vertical-middle">
              <Button variant="warning">Edit</Button>
            </th>
            <th>&nbsp;</th>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default QueuePage;
