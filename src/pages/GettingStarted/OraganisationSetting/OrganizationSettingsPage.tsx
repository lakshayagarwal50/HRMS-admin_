import React, { useState } from 'react';
import { Image } from 'lucide-react';

// Define the shape of the form data
interface OrgSettingsData {
  companyName: string;
  email: string;
  fullName: string;
  contactNumber: string;
  website: string;
  serviceTaxNumber: string;
  pan: string;
  adharNumber: string;
  gstin: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  zipCode: string;
}

// Initial data based on the screenshot
const initialData: OrgSettingsData = {
  companyName:'Appinventiv',
  email: '',
  fullName: '',
  contactNumber: '',
  website: '',
  serviceTaxNumber: '',
  pan: '',
  adharNumber: '',
  gstin: '',
  addressLine1: '',
  addressLine2: '',
  state: '',
  zipCode: '',
};

// A reusable input component for this form, now with a placeholder prop
const FormInput: React.FC<{ 
  label: string; 
  value: string; 
  name: keyof OrgSettingsData; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; 
}> = ({ label, value, name, onChange, placeholder }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 transition"
    />
  </div>
);

const OrganizationSettingsPage: React.FC = () => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <header className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Organization Settings</h1>
          <nav aria-label="Breadcrumb" className="mt-1">
            <ol className="flex items-center space-x-2 text-sm">
              <li><a href="/dashboard" className="text-gray-500 hover:text-gray-700">Dashboard</a></li>
              <li><span className="text-gray-500">/</span></li>
              <li><a href="/getting-started" className="text-gray-500 hover:text-gray-700">Getting Started</a></li>
              <li><span className="text-gray-500">/</span></li>
              <li><span className="text-gray-900 font-medium">Organization Settings</span></li>
            </ol>
          </nav>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo Section */}
            <div className="md:col-span-1">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Logo</h3>
              <div className="w-40 h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <Image className="text-gray-400" size={48} />
              </div>
            </div>

            {/* Form Fields Section */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <select id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 transition">
                  <option>Appinventiv</option>
                  <option>Another Company</option>
                </select>
              </div>
              <FormInput label="Email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" />
              <FormInput label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter full name" />
              <FormInput label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Enter contact number" />
              <FormInput label="Website" name="website" value={formData.website} onChange={handleChange} placeholder="https://example.com" />
              <FormInput label="Service Tax Number" name="serviceTaxNumber" value={formData.serviceTaxNumber} onChange={handleChange} placeholder="Enter service tax number" />
              <FormInput label="P.A.N." name="pan" value={formData.pan} onChange={handleChange} placeholder="Enter P.A.N. number" />
              <FormInput label="Adhar Number" name="adharNumber" value={formData.adharNumber} onChange={handleChange} placeholder="Enter Adhar number" />
              <FormInput label="GSTIN" name="gstin" value={formData.gstin} onChange={handleChange} placeholder="Enter GSTIN" />
              <FormInput label="Address Line1" name="addressLine1" value={formData.addressLine1} onChange={handleChange} placeholder="Enter address line 1" />
              <FormInput label="Address Line2" name="addressLine2" value={formData.addressLine2} onChange={handleChange} placeholder="Enter address line 2" />
              <FormInput label="State" name="state" value={formData.state} onChange={handleChange} placeholder="Enter state" />
              <FormInput label="Zip Code" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Enter zip code" />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
            <button type="button" className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 shadow-md transition-all">
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrganizationSettingsPage;
