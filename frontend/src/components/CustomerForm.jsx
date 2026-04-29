import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import { createCustomer, updateCustomer, getCustomerById, getCities, getCountries } from '../services/api';
import AddressForm from './AddressForm';
import FamilyMembers from './FamilyMembers';

const CustomerForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: null,
    nicNumber: '',
    mobileNumbers: [''],
    addresses: [{
      addressLine1: '',
      addressLine2: '',
      city: '',
      country: ''
    }],
    familyMembers: []
  });

  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadMasterData();
    if (isEditMode) {
      loadCustomerData();
    }
  }, [id]);

  const loadMasterData = async () => {
    try {
      const [citiesRes, countriesRes] = await Promise.all([
        getCities(),
        getCountries()
      ]);
      setCities(citiesRes.data);
      setCountries(countriesRes.data);
    } catch (error) {
      toast.error('Failed to load master data');
    }
  };

  const loadCustomerData = async () => {
    try {
      setLoading(true);
      const response = await getCustomerById(id);
      const customer = response.data;
      setFormData({
        name: customer.name,
        dateOfBirth: new Date(customer.dateOfBirth),
        nicNumber: customer.nicNumber,
        mobileNumbers: customer.mobileNumbers?.length ? customer.mobileNumbers : [''],
        addresses: customer.addresses?.length ? customer.addresses : [{
          addressLine1: '', addressLine2: '', city: '', country: ''
        }],
        familyMembers: customer.familyMembers || []
      });
    } catch (error) {
      toast.error('Failed to load customer data');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is mandatory';
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is mandatory';
    }
    if (!formData.nicNumber.trim()) {
      newErrors.nicNumber = 'NIC number is mandatory';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMobileChange = (index, value) => {
    const newMobileNumbers = [...formData.mobileNumbers];
    newMobileNumbers[index] = value;
    setFormData(prev => ({ ...prev, mobileNumbers: newMobileNumbers }));
  };

  const addMobileNumber = () => {
    setFormData(prev => ({
      ...prev,
      mobileNumbers: [...prev.mobileNumbers, '']
    }));
  };

  const removeMobileNumber = (index) => {
    const newMobileNumbers = formData.mobileNumbers.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, mobileNumbers: newMobileNumbers }));
  };

  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...formData.addresses];
    newAddresses[index][field] = value;
    setFormData(prev => ({ ...prev, addresses: newAddresses }));
  };

  const addAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [...prev.addresses, {
        addressLine1: '', addressLine2: '', city: '', country: ''
      }]
    }));
  };

  const removeAddress = (index) => {
    const newAddresses = formData.addresses.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, addresses: newAddresses }));
  };

  const handleFamilyMembersChange = (members) => {
    setFormData(prev => ({ ...prev, familyMembers: members }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);
      const submitData = {
        ...formData,
        mobileNumbers: formData.mobileNumbers.filter(m => m.trim()),
        addresses: formData.addresses.filter(a => a.addressLine1.trim() || a.city || a.country)
      };

      if (isEditMode) {
        await updateCustomer(id, submitData);
        toast.success('Customer updated successfully');
      } else {
        await createCustomer(submitData);
        toast.success('Customer created successfully');
      }
      onSuccess();
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4>{isEditMode ? 'Edit Customer' : 'Add New Customer'}</h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Name *</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Date of Birth *</label>
              <DatePicker
                selected={formData.dateOfBirth}
                onChange={(date) => setFormData(prev => ({ ...prev, dateOfBirth: date }))}
                className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`}
                dateFormat="yyyy-MM-dd"
                maxDate={new Date()}
                showYearDropdown
                scrollableYearDropdown
              />
              {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">NIC Number *</label>
              <input
                type="text"
                className={`form-control ${errors.nicNumber ? 'is-invalid' : ''}`}
                name="nicNumber"
                value={formData.nicNumber}
                onChange={handleInputChange}
              />
              {errors.nicNumber && <div className="invalid-feedback">{errors.nicNumber}</div>}
            </div>

            <div className="col-md-12 mb-3">
              <label className="form-label">Mobile Numbers (Optional)</label>
              {formData.mobileNumbers.map((mobile, index) => (
                <div key={index} className="input-group mb-2">
                  <input
                    type="tel"
                    className="form-control"
                    value={mobile}
                    onChange={(e) => handleMobileChange(index, e.target.value)}
                    placeholder="Enter mobile number"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeMobileNumber(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-secondary btn-sm" onClick={addMobileNumber}>
                Add Mobile Number
              </button>
            </div>
          </div>

          <h5 className="mt-3">Addresses</h5>
          <AddressForm
            addresses={formData.addresses}
            cities={cities}
            countries={countries}
            onAddressChange={handleAddressChange}
            onAddAddress={addAddress}
            onRemoveAddress={removeAddress}
          />

          <h5 className="mt-3">Family Members</h5>
          <FamilyMembers
            members={formData.familyMembers}
            onChange={handleFamilyMembersChange}
          />

          <div className="mt-4">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
            </button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;