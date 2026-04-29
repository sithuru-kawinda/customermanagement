import React, { useState } from 'react';
import { getCustomers } from '../services/api';

const FamilyMembers = ({ members, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  const searchCustomers = async () => {
    if (!searchTerm.trim()) return;
    try {
      const response = await getCustomers(0, 10);
      const filtered = response.data.content.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.nicNumber.includes(searchTerm)
      );
      setSearchResults(filtered);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const addFamilyMember = (customer) => {
    const newMember = {
      customerId: customer.id,
      name: customer.name,
      relationship: '',
      nicNumber: customer.nicNumber
    };
    onChange([...members, newMember]);
    setShowSearch(false);
    setSearchTerm('');
  };

  const updateRelationship = (index, relationship) => {
    const updatedMembers = [...members];
    updatedMembers[index].relationship = relationship;
    onChange(updatedMembers);
  };

  const removeMember = (index) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    onChange(updatedMembers);
  };

  return (
    <div className="family-members-container">
      {members.map((member, index) => (
        <div key={index} className="family-member-row card mb-2">
          <div className="card-body">
            <div className="row">
              <div className="col-md-5">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={member.name}
                  readOnly
                />
              </div>
              <div className="col-md-5">
                <label className="form-label">Relationship</label>
                <select
                  className="form-select"
                  value={member.relationship}
                  onChange={(e) => updateRelationship(index, e.target.value)}
                >
                  <option value="">Select Relationship</option>
                  <option value="SPOUSE">Spouse</option>
                  <option value="CHILD">Child</option>
                  <option value="PARENT">Parent</option>
                  <option value="SIBLING">Sibling</option>
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label">&nbsp;</label>
                <button
                  type="button"
                  className="btn btn-danger btn-sm d-block"
                  onClick={() => removeMember(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {!showSearch ? (
        <button
          type="button"
          className="btn btn-secondary btn-sm mt-2"
          onClick={() => setShowSearch(true)}
        >
          Add Family Member
        </button>
      ) : (
        <div className="card mt-2">
          <div className="card-body">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or NIC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-primary" onClick={searchCustomers}>
                Search
              </button>
              <button className="btn btn-secondary" onClick={() => setShowSearch(false)}>
                Cancel
              </button>
            </div>
            {searchResults.length > 0 && (
              <div className="list-group mt-2">
                {searchResults.map(customer => (
                  <button
                    key={customer.id}
                    className="list-group-item list-group-item-action"
                    onClick={() => addFamilyMember(customer)}
                  >
                    {customer.name} - {customer.nicNumber}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyMembers;