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