import { Post } from 'main/models/Post';
import { Row, Container } from 'react-bootstrap';
import PostCard from './PostCard';

function PostsPanel(props: { posts: Post[] | undefined }) {
  const { posts } = props;

  let s: Post[] = [];
  if (posts !== undefined) s = posts;

  return (
    <div className="black-bg">
      <Container>
        <Row className="fluid" xs="auto">
          {s.map((post) => (
            <PostCard post={post} key={post.post_id} />
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default PostsPanel;
