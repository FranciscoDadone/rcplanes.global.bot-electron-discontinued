import { Post } from 'main/models/Post';
import { Row, Container } from 'react-bootstrap';
import PostCard from './PostCard';
import '../../../assets/css/PostsPanel.css';

function PostsPanel(props: { posts: Post[] | undefined }) {
  const { posts } = props;

  let auxPosts: Post[] = [];
  if (posts !== undefined) auxPosts = posts;

  if (
    auxPosts === undefined ||
    auxPosts.length === 0 ||
    auxPosts[0].post_id === ''
  ) {
    return (
      <div className="black-bg">
        <h1 className="loading-tag">Loading content...</h1>
      </div>
    );
  }

  return (
    <div className="black-bg">
      <Container>
        <Row className="fluid" xs="auto">
          {auxPosts.map((post) => (
            <PostCard post={post} key={post.post_id} />
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default PostsPanel;
