import React, { useState, useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import LogoutButton from '../user/UserLogout';

const DocumentForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoc = async () => {
        const token = localStorage.getItem('token');

            if (id) {
                try {
                    const response = await fetch(`http://localhost:9000/documents/${id}`, {
                      headers: {
                        'x-access-token': `${token}`,
                      },
                    });
                    const data = await response.json();
                    setTitle(data.title);
                    setContent(data.content);
                } catch (error) {
                    console.error('Error fetching document:', error);
                }
            }
        };

        fetchDoc();
    }, [id]);

    const submitDoc = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const docData = { title, content };

        try {
            const requestOptions = {
              method: id ? 'PUT' : 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'x-access-token': `${token}`,
              },
              body: JSON.stringify(docData)
            };

            const url = id ? `http://localhost:9000/documents/${id}` : 'http://localhost:9000/documents/';

            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                throw new Error(`Miss`);
            }
            navigate('/documents');
        } catch (error) {
            console.error(`Error ${id ? 'updating' : 'creating'} document:`, error);
        }
    };

    return (
      <div id="form-container">
        < LogoutButton />
        <form onSubmit={submitDoc}>
        <h2>{id ? 'Edit Document' : 'Create New Document'}</h2>
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
          <button type="submit">{id ? 'Save' : 'Create'}</button>
          <button onClick={() => navigate('/')}>Cancel</button>
        </form>
      </div>
    );
};

export default DocumentForm;