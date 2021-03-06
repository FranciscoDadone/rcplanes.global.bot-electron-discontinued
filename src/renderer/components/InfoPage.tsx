// next upload date; total uploads; total queue; total followers; app status;
// total deleted; total posted; total likes

import { Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import moment from 'moment';
import '../../../assets/css/InfoPage.css';
import { ipcRenderer } from 'electron';

function InfoPage() {
  const [nextUpload, setNextUpload] = useState({
    nextUpload: '',
    eta: '',
  });

  useEffect(() => {
    let isMounted = true;

    if (nextUpload.nextUpload === '') {
      ipcRenderer
        .invoke('getUtilAndPostingRate')
        .then(
          (data: {
            id: number;
            last_upload_date: string;
            total_posted_medias: number;
            queued_medias: number;
            upload_rate: string;
          }) => {
            const nextPostDate = new Date(data.last_upload_date);
            nextPostDate.setHours(
              nextPostDate.getHours() + parseInt(data.upload_rate, 10)
            );
            setNextUpload({
              nextUpload: nextPostDate.toString(),
              eta: '',
            });
          }
        );
    }

    setTimeout(() => {
      if (isMounted) {
        const nextUploadDate = new Date(nextUpload.nextUpload);
        const now = new Date();

        const diff = moment
          .utc(
            moment(nextUploadDate, 'DD/MM/YYYY HH:mm:ss').diff(
              moment(now, 'DD/MM/YYYY HH:mm:ss')
            )
          )
          .format('HH:mm:ss');

        setNextUpload({
          nextUpload:
            parseInt(diff.substring(0, 2), 10) >= 23
              ? ''
              : nextUpload.nextUpload,
          eta: diff,
        });
      }
    }, 1000);
    return () => {
      isMounted = false;
    };
  });

  return (
    <Card className="cardContainer">
      <Card.Body className="cardBody">
        <h1 className="cardTitle">Uploads info</h1>
        <hr />
        <ul>
          <li>Next upload date: {nextUpload.nextUpload}</li>
          <li>ETA next upload: {nextUpload.eta}</li>
        </ul>
        <br />
        <h1 className="cardTitle">Database</h1>
        <hr />
        <ul>
          <li>Total queue: 0</li>
          <li>Total posted: 0</li>
          <li>Total fetched: 0</li>
        </ul>
      </Card.Body>
    </Card>
  );
}

export default InfoPage;
