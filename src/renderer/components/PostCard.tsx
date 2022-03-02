import { Card, Button, ButtonGroup } from 'react-bootstrap';
import path from 'path';
import { Post } from '../../main/models/Post';
import '../../../assets/css/PostCard.css';

const STORAGE_PATH = process.env.NODE_ENV
  ? path.join(__dirname, '../../../../../../storage')
  : path.join(process.resourcesPath, 'storage');

function reviewPost(post: Post) {
  console.log(post);
}

function PostCard(props: { post: Post }) {
  const { post } = props;
  if (post === undefined) return <div />;

  return (
    <div className="cardStyle">
      <Card
        style={{ width: '18rem', cursor: 'pointer' }}
        bg="dark"
        border="light"
        onClick={() => reviewPost(post)}
      >
        <Card.Body>
          <Card.Img
            variant="top"
            // /home/franciscodadone/Dev/rcplanes.global.bot
            src={`file://${STORAGE_PATH}${post.storage_path.substring(9)}`}
          />
          <br />
          <ButtonGroup>
            <Button variant="danger">Delete</Button>
          </ButtonGroup>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">Fetched: 00/00/0000</small>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default PostCard;
