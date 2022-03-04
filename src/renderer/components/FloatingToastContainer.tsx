import { ToastContainer } from 'react-bootstrap';

function FloatingToastContainer(props: { children: any }) {
  const { children } = props;
  return (
    <div style={{ position: 'absolute', top: 100, right: 0 }}>
      <ToastContainer>{children}</ToastContainer>
    </div>
  );
}

export default FloatingToastContainer;
