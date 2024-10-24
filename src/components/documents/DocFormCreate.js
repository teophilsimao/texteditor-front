import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../user/UserLogout';
import { Editor } from '@monaco-editor/react';
import { handleTheme, useMessage } from '../modell/editorUtils';

const DocumentFormCreate = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { error, setError} = useMessage();
    const [editorMode, setEditorMode] = useState('text');
    const navigate = useNavigate();

    const submitDoc = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const url = 'http://localhost:9000/documents/';
        const docData = { title, content, type: editorMode };

        try {
            const requestOptions = {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'x-access-token': `${token}`,
              },
              body: JSON.stringify(docData)
            };

            const response = await fetch(url, requestOptions);
            if (response.ok) {
              const newDoc = await response.json();
              const newId = newDoc._id;
              navigate(`/documents/${newId}/edit`);
            } else {
              setError('Failed to create Documnet');
            }
        } catch (error) {
            setError('Failed to create Documnet');
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
                      height="400px"
                      value={content}
                      defaultLanguage="javascript"
                      options={{
                          automaticLayout: true,
                          theme: 'vs-dark'
                      }}
                      onChange={(newValue) => setContent(newValue)}
                      onMount={(editor, monaco) => handleTheme(editor, monaco, editorMode)}
                      required
                  />
              )}
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Create</button>
          <button onClick={() => navigate('/documents')}>Cancel</button>
        </form>
      </div>
    );
};

export default DocumentFormCreate;