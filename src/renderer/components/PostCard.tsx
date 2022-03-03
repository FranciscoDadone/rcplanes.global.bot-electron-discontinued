import { Card, Button } from 'react-bootstrap';
import path from 'path';
import { Post } from '../../main/models/Post';
import '../../../assets/css/PostCard.css';

const STORAGE_PATH = process.env.NODE_ENV
  ? path.join(__dirname, '../../../../../../storage')
  : path.join(process.resourcesPath, 'storage');

function reviewPost(post: Post) {
  console.log(post);
}

function deletePost(post: Post) {
  console.log(`delete: ${post}`);
}

function PostCard(props: { post: Post }) {
  const { post } = props;
  if (post === undefined) return <div />;

  return (
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
          onClick={() => reviewPost(post)}
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
  );
}

export default PostCard;
