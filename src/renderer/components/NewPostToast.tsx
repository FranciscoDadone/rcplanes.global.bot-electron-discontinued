import { Toast } from 'react-bootstrap';
import { useState } from 'react';

function NewPostToast(props: { postId: string | undefined }) {
  const { postId } = props;
  const [show, setShow] = useState(true);

  if (postId === undefined) return <></>;

  return (
    <Toast
      bg="dark"
      onClose={() => setShow(false)}
      show={show}
      delay={4000}
      autohide
      animation
    >
      <Toast.Header>
        <strong className="me-auto">Media queued</strong>
      </Toast.Header>
      <Toast.Body className="text-white">
        Post #{postId} added to the queue.
      </Toast.Body>
    </Toast>
  );
}

export default NewPostToast;
