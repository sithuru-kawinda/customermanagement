import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCustomers, deleteCustomer } from '../services/api';
import { FaEdit, FaTrash } from 'react-icons/fa';

const CustomerTable = ({ refreshTrigger }) => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, [refreshTrigger]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCustomers(0, 20);
      console.log('API Response:', response.data);
      
      // Extract customer data from response
      let customerList = [];
      if (response.data && response.data.content) {
        customerList = response.data.content;
      } else if (response.data && response.data.data && response.data.data.content) {
        customerList = response.data.data.content;
      } else if (Array.isArray(response.data)) {
        customerList = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        customerList = response.data.data;
      }
      
      setCustomers(customerList);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers');
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteCustomer(id);
        toast.success('Customer deleted successfully');
        fetchCustomers();
      } catch (error) {
        toast.error('Failed to delete customer');
      }
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h4>Customer List</h4>
        </div>
        <div className="card-body text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading customers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-header">
          <h4>Customer List</h4>
        </div>
        <div className="card-body">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h4>Customer List ({customers.length} total)</h4>
      </div>
      <div className="card-body">
        {customers.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No customers found. Click "Add Customer" to create one.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Date of Birth</th>
                  <th>NIC Number</th>
                  <th>Mobile Numbers</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>{customer.name}</td>
                    <td>{customer.dateOfBirth ? new Date(customer.dateOfBirth).toLocaleDateString() : 'N/A'}</td>
                    <td>{customer.nicNumber}</td>
                    <td>
                      {customer.mobileNumbers && customer.mobileNumbers.length > 0 ? (
                        customer.mobileNumbers.map((num, idx) => <div key={idx}>{num}</div>)
                      ) : (
                        <span className="text-muted">No numbers</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => navigate(`/edit/${customer.id}`)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(customer.id, customer.name)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerTable;