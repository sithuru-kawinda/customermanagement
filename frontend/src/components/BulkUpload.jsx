import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { bulkUploadCustomers } from '../services/api';

const BulkUpload = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        selectedFile.type === 'application/vnd.ms-excel')) {
      setFile(selectedFile);
      setProgress(0);
    } else {
      toast.error('Please select a valid Excel file (.xlsx or .xls)');
      e.target.value = null;
    }
  };

  const validateExcelData = (data) => {
    const requiredFields = ['name', 'dateOfBirth', 'nicNumber'];
    const errors = [];
    
    data.forEach((row, index) => {
      const missingFields = requiredFields.filter(field => !row[field]);
      if (missingFields.length > 0) {
        errors.push(`Row ${index + 2}: Missing required fields - ${missingFields.join(', ')}`);
      }
    });
    
    return errors;
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      
      // Read and validate Excel file
      const data = await readExcelFile(file);
      const validationErrors = validateExcelData(data);
      
      if (validationErrors.length > 0) {
        toast.error(`Validation errors:\n${validationErrors.join('\n')}`);
        setUploading(false);
        return;
      }

      // Upload to backend with streaming support
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await bulkUploadCustomers(formData, (progress) => {
        setProgress(progress);
      });
      
      toast.success(response.data.message || 'Bulk upload completed successfully');
      onSuccess();
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Bulk upload failed');
    } finally {
      setUploading(false);
      setFile(null);
      setProgress(0);
      document.getElementById('fileInput').value = '';
    }
  };

  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsBinaryString(file);
    });
  };

  const downloadTemplate = () => {
    const template = [
      {
        name: 'John Doe',
        dateOfBirth: '1990-01-01',
        nicNumber: '123456789V',
        mobileNumbers: '0771234567,0712345678',
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4B',
        city: 'Colombo',
        country: 'Sri Lanka'
      }
    ];
    
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'customer_bulk_upload_template.xlsx');
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4>Bulk Customer Upload</h4>
      </div>
      <div className="card-body">
        <div className="alert alert-info">
          <h5>Instructions:</h5>
          <ul>
            <li>Upload an Excel file (.xlsx or .xls) with customer data</li>
            <li>Required columns: name, dateOfBirth (YYYY-MM-DD), nicNumber</li>
            <li>Optional columns: mobileNumbers (comma-separated), addressLine1, addressLine2, city, country</li>
            <li>For multiple mobile numbers, separate with commas (e.g., "0771234567,0712345678")</li>
            <li>The file can contain up to 1,000,000 records (processing time may vary)</li>
          </ul>
          <button className="btn btn-link" onClick={downloadTemplate}>
            Download Template
          </button>
        </div>

        <div className="mb-3">
          <label className="form-label">Select Excel File</label>
          <input
            id="fileInput"
            type="file"
            className="form-control"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>

        {file && (
          <div className="mb-3">
            <div className="alert alert-secondary">
              Selected file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          </div>
        )}

        {uploading && (
          <div className="mb-3">
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
            </div>
            <div className="text-center mt-2">
              <small>Processing large file... Please do not close the browser</small>
            </div>
          </div>
        )}

        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload and Process'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/')}
            disabled={uploading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;