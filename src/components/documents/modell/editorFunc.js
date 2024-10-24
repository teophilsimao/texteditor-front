export const handleTheme = (editor, monaco, editorMode) => {
    if (editorMode === 'code') {
        monaco.editor.setTheme('vs-dark');
    } else {
        monaco.editor.setTheme('vs');
    }
};
