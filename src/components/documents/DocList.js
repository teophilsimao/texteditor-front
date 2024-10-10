import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import LogoutButton from '../user/UserLogout';

const DocumentList = () => {
    const [documents, setDocs] = useState([]);

    useEffect(() => {
        const fetchDocs = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await fetch('http://localhost:9000/documents/', {
                    headers: {
                        'x-access-token': `${token}`,
                    }
                });
                const data = await response.json()
                setDocs(data);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        fetchDocs();
    }, []);

    const deleteDoc = async (id) => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:9000/documents/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-access-token': `${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Miss!');
            }

            setDocs(documents.filter(doc => doc._id !== id));
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    }

    return (
        <div>
            < LogoutButton />
            <h2>Documents</h2>
            <Link to="/documents/new">Create New Document</Link>
            <div className='list-container'>
                <ul>
                    {documents.map((doc) => (
                        <li key={doc._id}>
                            <Link to={`/documents/${doc._id}/edit`}>{doc.title}</Link>
                            <button onClick={() => deleteDoc(doc._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DocumentList;