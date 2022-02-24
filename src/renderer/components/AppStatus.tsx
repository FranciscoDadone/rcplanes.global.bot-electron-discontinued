import React from 'react';
import { Spinner } from 'react-bootstrap';

export default function AppStatus(props: { status:string }) {
  if (props.status !== 'Idling...') {
      return (
        <div>
            <h5>
                <Spinner animation="border" role="status" size="sm">
                <span className="visually-hidden">Loading...</span>
                </Spinner>
                {` ${props.status}`}
            </h5>
        </div>
      );
  } else {
    return (
        <div>
            <h5>
                {props.status}
            </h5>
        </div>
    );
  }
}
