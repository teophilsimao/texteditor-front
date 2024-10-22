import React, { useState, useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import LogoutButton from '../user/UserLogout';

const DocumentFormCreate = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const submitDoc = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const docData = { title, content };

        try {
            const requestOptions = {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'x-access-token': `${token}`,
              },
              body: JSON.stringify(docData)
            };

            const url = 'http://localhost:9000/documents/';

            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                throw new Error(`Miss`);
            }
            navigate('/documents');
        } catch (error) {
            console.error(`Error creating document:`, error);
        }
    };

    return (
      <div id="form-container">
        < LogoutButton />
        <form onSubmit={submitDoc}>
        <h2>Create New Document</h2>
          <label htmlFor='title'>Title:</label>
          <div id="title-container">
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <label htmlFor="content">Content:</label>
          <div id="textarea-container">
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <button type="submit">'Create</button>
          <button onClick={() => navigate('/documents')}>Cancel</button>
        </form>
      </div>
    );
};

export default DocumentFormCreate;