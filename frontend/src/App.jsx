import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { checkBackendHealth } from './services/api';
import CustomerForm from './components/CustomerForm';
import CustomerTable from './components/CustomerTable';
import BulkUpload from './components/BulkUpload';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [refresh, setRefresh] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      await checkBackendHealth();
      setBackendStatus('connected');
      console.log('✅ Backend is connected');
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      setBackendStatus('disconnected');
    }
  };

  const triggerRefresh = () => setRefresh(!refresh);

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <Link className="navbar-brand" to="/">
              Customer Management System
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Customer List
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add">
                    Add Customer
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/bulk-upload">
                    Bulk Upload
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {backendStatus === 'disconnected' && (
          <div className="alert alert-warning m-3 alert-dismissible fade show" role="alert">
            <strong>⚠️ Warning!</strong> Backend server is not running. Please start the Spring Boot application on port 8080.
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        )}

        {backendStatus === 'connected' && (
          <div className="alert alert-success m-3 alert-dismissible fade show" role="alert">
            <strong>✅ Success!</strong> Connected to backend server successfully.
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        )}

        <div className="container mt-4">
          <Routes>
            <Route 
              path="/" 
              element={<CustomerTable refreshTrigger={refresh} />} 
            />
            <Route 
              path="/add" 
              element={<CustomerForm onSuccess={triggerRefresh} />} 
            />
            <Route 
              path="/edit/:id" 
              element={<CustomerForm onSuccess={triggerRefresh} />} 
            />
            <Route 
              path="/bulk-upload" 
              element={<BulkUpload onSuccess={triggerRefresh} />} 
            />
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;