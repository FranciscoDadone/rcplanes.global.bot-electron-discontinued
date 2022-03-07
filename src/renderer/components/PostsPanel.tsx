import { Post } from 'main/models/Post';
import { Row, Container, Pagination } from 'react-bootstrap';
import { useState } from 'react';
import PostCard from './PostCard';
import '../../../assets/css/PostsPanel.css';

function splitUp(arr, n) {
  const rest = arr.length % n; // how much to divide
  let restUsed = rest; // to keep track of the division over the elements
  const partLength = Math.floor(arr.length / n);
  const result = [];

  for (let i = 0; i < arr.length; i += partLength) {
    let end = partLength + i;
    let add = false;

    if (rest !== 0 && restUsed) {
      // should add one element for the division
      end++;
      restUsed--; // we've used one division element now
      add = true;
    }

    result.push(arr.slice(i, end)); // part of the array

    if (add) {
      i++; // also increment i in the case we added an extra element for division
    }
  }

  return result;
}

function PostsPanel(props: { posts: Post[] | undefined }) {
  const { posts } = props;

  const [activeTab, setActiveTab] = useState(1);

  let auxPosts: any = [];
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

  auxPosts = splitUp(auxPosts, auxPosts.length / 55);

  const items = [];
  for (let number = 1; number <= auxPosts.length; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === activeTab}
        onClick={() => setActiveTab(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <div className="black-bg">
      <Container>
        <div className="paginationDiv">
          <Pagination className="pagination">{items}</Pagination>
        </div>

        <Row className="fluid" xs="auto">
          {auxPosts[activeTab - 1].map((post: any) => (
            <PostCard post={post} key={post.post_id} />
          ))}
        </Row>

        <div className="paginationDiv paginationBottom">
          <Pagination className="pagination">{items}</Pagination>
        </div>
      </Container>
    </div>
  );

  // return (
  //   <div className="black-bg">
  //     <Container>
  //       <Row className="fluid" xs="auto">
  //         {auxPosts.map((post) => (
  //           <PostCard post={post} key={post.post_id} />
  //         ))}
  //       </Row>
  //     </Container>
  //   </div>
  // );
}

export default PostsPanel;
