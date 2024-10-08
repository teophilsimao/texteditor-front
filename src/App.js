import React from "react";
import {HashRouter as Router, Route, Routes} from 'react-router-dom';
import DocumentList from "./components/DocList";
import DocumentForm from "./components/DocForm";
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<DocumentList />} />
          <Route path="/document/new" element={<DocumentForm />} />
          <Route path="/document/:id/edit" element={<DocumentForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
