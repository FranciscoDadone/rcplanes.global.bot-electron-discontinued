import {
  Form,
  Button,
  Row,
  Col,
  InputGroup,
  Container,
  FormControl,
} from 'react-bootstrap';
import { useState } from 'react';
import { ipcRenderer } from 'electron';

function ConfigurationPage() {
  const [validated, setValidated] = useState(false);
  const [hashtagsToFetch, setHashtagsToFetch] = useState<
    [{ id: number; hashtag: string }]
  >([{ id: 0, hashtag: 'null' }]);
  const [addHashtagState, setAddHashtagState] = useState<string>('');

  if (hashtagsToFetch[0] && hashtagsToFetch[0].hashtag === 'null')
    ipcRenderer.invoke('getHashtagsToFetch');

  ipcRenderer.on(
    'hashtagsToFetch',
    (_ev, data: [{ id: number; hashtag: string }]) => {
      setHashtagsToFetch(data);
    }
  );

  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    if (form.checkValidity()) {
      const formData = new FormData(form);
      const formDataObj = Object.fromEntries(formData.entries());
      console.log(formDataObj);
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const handleDeleteHashtag = (index: number) => {
    const hashtags: any = [];
    ipcRenderer.send('deleteHashtag', [hashtagsToFetch[index].hashtag]);
    hashtagsToFetch.forEach((h, i) => {
      if (i !== index) hashtags.push(h);
    });
    setHashtagsToFetch(hashtags);
  };

  const handleAddHashtag = () => {
    const aux: any = hashtagsToFetch;
    if (addHashtagState !== '') {
      let lastElem: any = { id: 0, hashtag: '' };
      if (hashtagsToFetch.length > 0) {
        lastElem = hashtagsToFetch[hashtagsToFetch.length - 1];
      }
      aux.push({
        id: lastElem.id + 1,
        hashtag: addHashtagState,
      });
      ipcRenderer.send('addHashtag', [addHashtagState]);
    }
    setHashtagsToFetch(aux);
    setAddHashtagState('');
  };

  const addHashtagChange = (e: any) => {
    setAddHashtagState(e.target.value);
  };

  return (
    <Container>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <h1>General configuration</h1>
        <Row className="mb-3">
          <Form.Group as={Col} md="2" controlId="validationCustom01">
            <Form.Label>Upload rate in hours</Form.Label>
            <Form.Control
              required
              type="number"
              defaultValue="3"
              name="uploadRate"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="validationCustom01">
            <Form.Label>Description boilerplate</Form.Label>
            <Form.Control
              required
              defaultValue=""
              name="descriptionBoilerplate"
              as="textarea"
              rows={10}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row>
          <h4>Hashtags to fetch</h4>
          {hashtagsToFetch.map((hashtag: any, index) => (
            <InputGroup className="mb-3" key={hashtag.id}>
              <FormControl
                aria-describedby="basic-addon2"
                defaultValue={hashtag.hashtag}
                name={`hashtag${index}`}
                readOnly
              />
              <Button
                variant="outline-danger"
                id="button-addon2"
                onClick={() => handleDeleteHashtag(index)}
              >
                Delete
              </Button>
            </InputGroup>
          ))}
          <InputGroup className="mb-3">
            <FormControl
              aria-describedby="basic-addon2"
              name="addHashtag"
              value={addHashtagState}
              onChange={addHashtagChange}
            />
            <Button
              variant="outline-primary"
              id="button-addon2"
              onClick={handleAddHashtag}
            >
              Add hashtag
            </Button>
          </InputGroup>
        </Row>

        <h1>Authentication</h1>
        <Button type="submit">Submit form</Button>
      </Form>
    </Container>
  );
}

export default ConfigurationPage;
