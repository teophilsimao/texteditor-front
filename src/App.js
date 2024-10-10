import React from "react";
import {HashRouter as Router, Route, Routes} from 'react-router-dom';
import DocList from "./components/documents/DocList";
import DocForm from "./components/documents/DocForm";
import UserLogin from "./components/user/UserLogin";
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
              <DocForm />
            </PrivateRoute>} 
          />

          <Route 
          path="/documents/:id/edit" 
          element={
            <PrivateRoute>
              <DocForm />
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
