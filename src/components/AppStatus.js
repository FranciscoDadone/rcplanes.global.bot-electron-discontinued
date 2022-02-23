import React from 'react';
import { Spinner } from 'react-bootstrap';

export default function AppStatus(props) {
  const { status } = props;
  if (status !== 'Idling...') {
      return (
        <div>
            <h5>
                <Spinner animation="border" role="status" size="sm">
                <span className="visually-hidden">Loading...</span>
                </Spinner>
                {` ${status}`}
            </h5>
        </div>
      );
  } else {
    return (
        <div>
            <h5>
                {status}
            </h5>
        </div>
    );
  }
}
