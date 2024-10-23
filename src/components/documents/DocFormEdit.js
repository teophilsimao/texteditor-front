import React, { useState, useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import LogoutButton from '../user/UserLogout';
import { Editor } from '@monaco-editor/react';
// import {Controlled as CodeMirror} from 'react-codemirror2';
// import 'codemirror/lib/codemirror.css';


const DocumentFormEdit = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [shareEmail, setShareEmail] = useState('');
    const { id } = useParams();
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [editorMode, setEditorMode] = useState('text');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoc = async () => {
        const token = localStorage.getItem('token');
        const url = `http://localhost:9000/documents/${id}`;

            if (id) {
                try {
                    const requestOptions = {
                      headers: {
                        'x-access-token': `${token}`,
                      },
                    };
                    const response = await fetch(url, requestOptions);
                    const data = await response.json() 

                    setTitle(data.title);
                    setContent(data.content);
                    setEditorMode(data.type);
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
        const url = `http://localhost:9000/documents/${id}`;
        const docData = { title, content, type: editorMode };
        try {
            const requestOptions = {
              method:'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'x-access-token': `${token}`,
              },
              body: JSON.stringify(docData)
            };

            await fetch(url, requestOptions);
            navigate(`/documents/${id}/edit`);
            setMessage(`Document saved`);
        } catch (error) {
            console.error(`Error 'updating' document:`, error);
        }
    };

    const shareDoc = async () => {
      const token = localStorage.getItem('token');
      const url = `http://localhost:9000/documents/${id}/share`;
      const docData = { email: shareEmail };
      try {
        const requestOptions = {
          method:'POST',
          headers: {
              'Content-Type': 'application/json',
              'x-access-token': `${token}`,
          },
          body: JSON.stringify(docData)
        };
        const response = await fetch(url, requestOptions);

        if (response.ok) {
          setMessage(`Document shared to ${shareEmail}`);
          setShareEmail('');
        } else {
          const errorData = await response.json();
          setError(`Failed to share document: ${errorData.errors.detail}`);
        }
      } catch (error) {
        console.error('Error sharing document:', error);
        setError('Failed to share document!');
      }
    };

    const codeMode = async () => {
      const token = localStorage.getItem('token');
      const url = `http://localhost:9000/documents/${id}/codemode`;
      const docData = { code: btoa(content) };

      try {
        const requestOptions = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'x-access-token': `${token}`,
          },
          body: JSON.stringify(docData),
        };
        const response = await fetch(url, requestOptions);

        if (response.ok) {
          const result = await response.json();
          const decodedOutput = atob(result.data); 
          setMessage(`Result: ${decodedOutput}`);
        } else {
          const errorData = await response.json();
          setError(`Execution failed: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error executing code:', error);
        setError('Failed to execute code!');
      }
    }

    return (
      <div id="form-container">
        < LogoutButton />
        <form onSubmit={submitDoc}>
          <h2>Edit Document</h2>
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
            <select onChange={(e) => setEditorMode(e.target.value)} value={editorMode}>
                <option value="text">Text Editor</option>
                <option value="code">Code Editor</option>
            </select>
            {editorMode === 'text' ? (
              <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
              />
            ) : (
              <Editor
                  height='400px'
                  value={content}
                  defaultLanguage='javascript'
                  options={{
                      automaticLayout: true,
                      theme: 'vs-dark'
                  }}
                  onChange={(value) => {
                      setContent(value);
                  }}
              />
            )}
          </div>


          <button type="submit">Save</button>
          <button onClick={() => navigate('/documents')}>Cancel</button>
        </form>

        {id && (
          <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            <h3>Share Document:</h3>
              <input
              type='email'
              placeholder='Enter email to share'
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)} 
              />
            <button onClick={shareDoc}>Share document</button>
            {editorMode === 'code' && (
                <button onClick={codeMode}>Run code</button>
            )}
          </div>
        )}
      </div>
    );
};

export default DocumentFormEdit;