import React from "react";
import {HashRouter as Router, Route, Routes} from 'react-router-dom';
import DocList from "./components/documents/DocList";
import DocumentFormEdit from "./components/documents/DocFormEdit";
import DocumentFormCreate from "./components/documents/DocFormCreate";
import UserLogin from "./components/user/UserLogin";
import UserRegister from "./components/user/UserRegister";
import PrivateRoute from "./components/user/PrivateRoute";
import UserVerified from "./components/user/UserVerified";
import EmailVerification from "./components/user/EmailVerification";
import './App.css';

function App() {

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<UserLogin />}/>
          <Route path="/register" element={< UserRegister />} />

          <Route 
          path="/documents" 
          element={
            <PrivateRoute>
              <DocList />
            </PrivateRoute>} 
          />

          <Route 
          path="/documents/new" 
          element={
            <PrivateRoute>
              <DocumentFormCreate />
            </PrivateRoute>} 
          />

          <Route 
          path="/documents/:id/edit" 
          element={
            <PrivateRoute>
              <DocumentFormEdit />
            </PrivateRoute>} 
          />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/user-verified" element={<UserVerified />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
