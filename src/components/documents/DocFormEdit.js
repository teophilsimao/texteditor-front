import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LogoutButton from '../user/UserLogout';
import { Editor } from '@monaco-editor/react';
import { handleTheme, useMessage } from '../modell/editorUtils';
import { useSocket } from '../../context/SocketContext';

const DocumentFormEdit = () => {
    const [documentState, setDocumentState] = useState({ title: '', content: '', type: 'text' });
    const [shareEmail, setShareEmail] = useState('');
    const { id } = useParams();
    const { error, setError, message, setMessage } = useMessage();
    const { socket } = useSocket();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoc = async () => {
            const token = localStorage.getItem('token');
            const url = `http://localhost:9000/documents/${id}`;

                try {
                    const requestOptions = {
                        headers: {
                            'x-access-token': `${token}`,
                        },
                    };
                    const response = await fetch(url, requestOptions);
                    const data = await response.json();

                    if (data && data.title && data.content && data.type) {
                        setDocumentState({ title: data.title, content: data.content, type: data.type });
                    }
                } catch (error) {
                    console.error('Error fetching document:', error);
                }
            }

          if (id) {
              fetchDoc();
          }
    }, [id]);

    useEffect(() => {
        if (socket) {
            socket.emit("join-room", { roomId: id });
            // console.log(`User joined room: ${id}`);

            socket.on("docUpdate", (data) => {
                const { field, value } = data;

                setDocumentState((prevState) => ({
                    ...prevState,
                    [field]: value,
                }));
            });

            socket.on("connected-users", (userList) => {
                console.log("Connected users in the room:", userList);
            });

            return () => {
                socket.emit("leave-room", { roomId: id });
                // console.log(`User left room: ${id}`);
                socket.off("docUpdate");
                socket.off("connected-users");
            };
        }
    }, [socket, id]);

    const handleFieldChange = (field, value) => {
        setDocumentState((prevState) => ({
            ...prevState,
            [field]: value,
        }));
        console.log(field, value);

        socket.emit('updateDoc', { roomId: id, field, value });
    };

    const submitDoc = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const url = `http://localhost:9000/documents/${id}`;
        const docData = { ...documentState };
        try {
            const requestOptions = {
                method: 'PUT',
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
            console.error(`Error updating document:`, error);
        }
    };

    const shareDoc = async () => {
        const token = localStorage.getItem('token');
        const url = `http://localhost:9000/documents/${id}/share`;
        const docData = { email: shareEmail };
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
        const docData = { code: btoa(documentState.content) };

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
                setError(`Failed to run: Make sure to save the edited code before running`);
            }
        } catch (error) {
            console.error('Error executing code:', error);
            setError('Failed to run the code!');
        }
    }

    return (
        <div id="form-container">
            <LogoutButton />
            <form onSubmit={submitDoc}>
                <h2>Edit Document</h2>
                <label htmlFor='title'>Title:</label>
                <div id="title-container">
                    <input
                        id="title"
                        type="text"
                        value={documentState.title}
                        onChange={(e) => handleFieldChange('title', e.target.value)}
                        required
                    />
                </div>
                
                <label htmlFor="content">Content:</label>
                <div id="textarea-container">
                    <select onChange={(e) => handleFieldChange('type', e.target.value)} value={documentState.type}>
                        <option value="text">Text Editor</option>
                        <option value="code">Code Editor</option>
                    </select>
                    {documentState.type === 'text' ? (
                        <textarea
                            id="content"
                            value={documentState.content}
                            onChange={(e) => handleFieldChange('content', e.target.value)}
                            required
                        />
                    ) : (
                        <Editor
                            height='400px'
                            value={documentState.content}
                            defaultLanguage='javascript'
                            options={{
                                automaticLayout: true,
                                theme: 'vs-dark',
                            }}
                            onChange={(value) => {
                                handleFieldChange('content', value);
                            }}
                            onMount={(editor, monaco) => handleTheme(editor, monaco, documentState.type)}
                            required
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
                    {documentState.type === 'code' && (
                        <button onClick={codeMode}>Run code</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default DocumentFormEdit;
