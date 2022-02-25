import { Card, Button, ButtonGroup } from 'react-bootstrap';
import { useState } from 'react';
import { Post } from '../../main/models/Post';
import img from '/home/franciscodadone/Dev/rcplanes.global.bot/storage/17936021755948047.png';
import '../../../assets/css/PostCard.css';

function reviewPost(post: Post) {
  console.log(post);
}

function PostCard(props: { post: Post }) {
  const { post } = props;

  const [image, setImage] = useState<typeof import('*.png')>();

  // console.log(`/home/franciscodadone/Dev/rcplanes.global.bot${post.storage_path.substring(1)}`);

  const url = `/home/franciscodadone/Dev/rcplanes.global.bot${post.storage_path.substring(
    1
  )}`;

    console.log(url)

  return (
    <div className="cardStyle">
      <Card
        style={{ width: '18rem', cursor: 'pointer' }}
        bg="dark"
        border="light"
        onClick={() => reviewPost(post)}
      >
        <Card.Body>
          <Card.Img variant="top" src={img} />
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
