import { Modal, Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import path from 'path';
import Media from './Media';

const STORAGE_PATH = process.env.NODE_ENV
  ? path.join(__dirname, '../../../../../../storage')
  : path.join(process.resourcesPath, 'storage');

function MediaModal(props: {
  show: boolean;
  post: any;
  media: any;
  mediaType: string;
}) {
  const { show, post, media, mediaType } = props;
  const [caption, setCaption] = useState(post.caption);
  const [username, setUsername] = useState(post.username);
  const [mediaModal, setMediaModal] = useState(media);
  const handleClose = () => {
    ipcRenderer.invoke('hideModal');
  };

  const handleDelete = () => {
    ipcRenderer
      .invoke('deletePost', {
        id: post.post_id,
      })
      .then((res) => {
        if (res === true) {
          handleClose();
        }
      });
  };

  const handleQueue = () => {
    ipcRenderer
      .invoke('addToQueue', {
        id: post.post_id,
        media: mediaModal,
        mediaType,
        caption,
      })
      .then((res) => {
        if (res === true) {
          handleClose();
        }
      });
  };

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        if (post.media_type === 'IMAGE') {
          ipcRenderer
            .invoke('postProcessImage', {
              path: `${STORAGE_PATH}/${post.storage_path}`,
              username,
            })
            .then((res) => {
              setMediaModal(res);
            });
        }
      }, 1000);
    }
  });

  return (
    <>
      <Modal show={show} onHide={handleClose} fullscreen className="modal">
        <Modal.Header closeButton>
          <Modal.Title>
            Post from: @{post.username} (#{post.hashtag})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: '#282c34' }}>
          <div className="modal-container">
            <div className="modal-image">
              <Media mediaType={mediaType} media={mediaModal} />
              <div style={{ display: 'flex' }}>
                <div>
                  <ul>
                    <li>Owner: {post.username}</li>
                    <li>ID: {post.post_id}</li>
                    <li>Hashtag: {post.hashtag}</li>
                  </ul>
                </div>
                <div>
                  <ul>
                    <li>Fetched: {post.date}</li>
                    <li>Type: {post.media_type}</li>
                    <li>Link: {post.permalink}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div style={{ width: '100%', paddingLeft: '1rem' }}>
              <Form>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={post.username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Caption</Form.Label>
                  <Form.Control
                    as="textarea"
                    defaultValue={post.caption}
                    rows={16}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="success" onClick={() => handleQueue()}>
            ✉️ Queue media
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MediaModal;
