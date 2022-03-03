import { Card, Button, Modal, Form } from 'react-bootstrap';
import { useState } from 'react';
import path from 'path';
import { Post } from '../../main/models/Post';
import '../../../assets/css/PostCard.css';

const STORAGE_PATH = process.env.NODE_ENV
  ? path.join(__dirname, '../../../../../../storage')
  : path.join(process.resourcesPath, 'storage');

function deletePost(post: Post) {
  console.log(`delete: ${post}`);
}

function PostCard(props: { post: Post }) {
  const { post } = props;

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if (post === undefined) return <div />;

  return (
    <>
      <div className="cardStyle">
        <Card
          style={{
            width: '18rem',
            height: '25.5rem',
          }}
          bg="dark"
          border="light"
        >
          <Card.Body
            className="container"
            style={{ cursor: 'pointer' }}
            onClick={() => handleShow()}
          >
            <Card.Img
              variant="top"
              src={`file://${STORAGE_PATH}/${post.storage_path}`}
            />
          </Card.Body>
          <Card.Footer>
            <div className="footer-container">
              <div>
                <small className="text-muted">Fetched: {post.date}</small>
              </div>
              <div className="trashcan">
                <Button variant="danger" onClick={() => deletePost(post)}>
                  <img
                    src="https://img.icons8.com/ios-glyphs/25/000000/trash--v1.png"
                    alt="trash can"
                  />
                </Button>
              </div>
            </div>
          </Card.Footer>
        </Card>
      </div>

      <Modal show={show} onHide={handleClose} fullscreen className="modal">
        <Modal.Header closeButton>
          <Modal.Title>
            Post from: @{post.username} (#{post.hashtag})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: '#282c34' }}>
          <div className="modal-container">
            <div className="modal-image">
              <div>
                <img
                  src={`file://${STORAGE_PATH}/${post.storage_path}`}
                  alt="img"
                  width={600}
                />
              </div>
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
                  <Form.Control type="text" value={post.username} />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Caption</Form.Label>
                  <Form.Control as="textarea" value={post.caption} rows={20} />
                </Form.Group>
              </Form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={handleClose}>
            ✉️ Publish media
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PostCard;
