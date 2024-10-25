//editorUtils.js 
import { useState } from "react";

export const handleTheme = (editor, monaco, editorMode) => {
    if (editorMode === 'code') {
        monaco.editor.setTheme('vs-dark');
    } else {
        monaco.editor.setTheme('vs');
    }
};

export const useMessage = () => {
    const [error, setErrorState] = useState('');
    const [message, setMessageState] = useState('');

    const setError = (newError) => {
        setErrorState(newError);
        setMessageState('');
    };

    const setMessage = (newMessage) => {
        setMessageState(newMessage);
        setErrorState('');
    };

    const clearMessages = () => {
        setErrorState('');
        setMessageState('');
    };

    return {
        error,
        setError,
        message,
        setMessage,
        clearMessages,
    };
};

export const useDocs = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [shareEmail, setShareEmail] = useState('');
    const [editorMode, setEditorMode] = useState('text');

    return {
        title,
        setTitle,
        content,
        setContent,
        shareEmail,
        setShareEmail,
        editorMode,
        setEditorMode
    };
};

export const useUser = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');

    return {
        email,
        setEmail,
        password,
        setPassword,
        token,
        setToken
    };
};