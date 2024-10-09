import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

const DocumentList = () => {
    const [documents, setDocs] = useState([]);

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const response = await fetch('https://jsramverk-editor-tesi23-beh7hvfadub6fugk.northeurope-01.azurewebsites.net/data');
                const data = await response.json()
                setDocs(data);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        fetchDocs();
    }, []);

    const deleteDoc = async (id) => {
        try {
            const response = await fetch(`https://jsramverk-editor-tesi23-beh7hvfadub6fugk.northeurope-01.azurewebsites.net/data/${id}`, {
                method: 'DELETE'
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
            <h2>Documents</h2>
            <Link to="/document/new">Create New Document</Link>
            <div className='list-container'>
                <ul>
                    {documents.map((doc) => (
                        <li key={doc._id}>
                            <Link to={`/document/${doc._id}/edit`}>{doc.title}</Link>
                            <button onClick={() => deleteDoc(doc._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DocumentList;