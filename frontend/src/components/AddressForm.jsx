import React from 'react';

const AddressForm = ({ addresses, cities, countries, onAddressChange, onAddAddress, onRemoveAddress }) => {
  return (
    <div className="addresses-container">
      {addresses.map((address, index) => (
        <div key={index} className="address-row card mb-2">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-2">
                <label className="form-label">Address Line 1</label>
                <input
                  type="text"
                  className="form-control"
                  value={address.addressLine1}
                  onChange={(e) => onAddressChange(index, 'addressLine1', e.target.value)}
                  placeholder="Street address"
                />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label">Address Line 2</label>
                <input
                  type="text"
                  className="form-control"
                  value={address.addressLine2}
                  onChange={(e) => onAddressChange(index, 'addressLine2', e.target.value)}
                  placeholder="Apartment, suite, etc."
                />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label">City</label>
                <select
                  className="form-select"
                  value={address.city}
                  onChange={(e) => onAddressChange(index, 'city', e.target.value)}
                >
                  <option value="">Select City</option>
                  {cities.map((city, idx) => (
                    <option key={idx} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label">Country</label>
                <select
                  className="form-select"
                  value={address.country}
                  onChange={(e) => onAddressChange(index, 'country', e.target.value)}
                >
                  <option value="">Select Country</option>
                  {countries.map((country, idx) => (
                    <option key={idx} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>
            {index > 0 && (
              <button
                type="button"
                className="btn btn-sm btn-danger mt-2"
                onClick={() => onRemoveAddress(index)}
              >
                Remove Address
              </button>
            )}
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-secondary btn-sm mt-2" onClick={onAddAddress}>
        Add Address
      </button>
    </div>
  );
};

export default AddressForm;