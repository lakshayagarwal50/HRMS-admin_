import React, { useState, useEffect, useRef, useCallback, type ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Image, X, RefreshCw, ServerCrash, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import {
  fetchOrganizationSettings,
  updateOrganizationSettings,
  uploadOrganizationLogo, 
  type OrganizationSettings,
} from '../../../store/slice/organizationSlice'; 
import type { RootState, AppDispatch } from '../../../store/store';


const FormSkeleton: React.FC = () => (
  <div className="w-full bg-white p-8 rounded-lg shadow-md animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="w-40 h-40 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(12)].map((_, i) => (
          <div key={i}>
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded-md w-full"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);


const ErrorState: React.FC<{ onRetry: () => void; error: string | null }> = ({ onRetry, error }) => (
  <div className="text-center py-10 px-4 bg-red-50 border border-red-200 rounded-lg">
    <ServerCrash className="mx-auto h-12 w-12 text-red-400" />
    <h3 className="mt-2 text-lg font-semibold text-red-800">Failed to Load Settings</h3>
    <p className="mt-1 text-sm text-red-600">{error || 'An unknown error occurred.'}</p>
    <div className="mt-6">
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
      >
        <RefreshCw className="-ml-1 mr-2 h-5 w-5" />
        Try Again
      </button>
    </div>
  </div>
);


const FormInput: React.FC<{
  label: string;
  name: keyof Omit<OrganizationSettings, 'logoUrl'>;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}> = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="text"
      id={name}
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 transition"
    />
  </div>
);

// Main component
const OrganizationSettingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { data: settings, status, error } = useSelector((state: RootState) => state.organizationSettings);

  const [formData, setFormData] = useState<Omit<OrganizationSettings, 'logoUrl'> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchOrganizationSettings());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (settings) {
      const { logoUrl: _, ...rest } = settings;
      setFormData(rest);
    }
  }, [settings]);
  
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => (prev ? { ...prev, [name]: value } : null));
  }, []);

  const handleLogoChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch(uploadOrganizationLogo(file));
    }
  }, [dispatch]);

  const handleCancel = useCallback(() => {
    navigate('/getting-started');
  }, [navigate]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      dispatch(updateOrganizationSettings(formData));
    }
  }, [formData, dispatch]);
  
  const renderContent = () => {
    if ((status === 'loading' || status === 'idle') && !settings) {
      return <FormSkeleton />;
    }

    if (status === 'failed' && !settings) {
      return <ErrorState onRetry={() => dispatch(fetchOrganizationSettings())} error={error} />;
    }
    
    if (settings && formData) {
      return (
        <form onSubmit={handleSubmit}>
            <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Logo</h3>
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-40 h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer relative group overflow-hidden"
                >
                    <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoChange}
                    className="hidden"
                    accept="image/*"
                    />
                    {settings.logoUrl ? (
                    <img
                        src={settings.logoUrl}
                        alt="Company Logo"
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    ) : (
                    <Image size={48} className="text-gray-400" />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-opacity rounded-lg" aria-hidden="true">
                    <Upload className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
                    </div>
                </div>
                </div>
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Enter company name" />
                <FormInput label="Email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" />
                <FormInput label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Enter contact number" />
                <FormInput label="Website" name="website" value={formData.website} onChange={handleChange} placeholder="https://example.com" />
                <FormInput label="Service Tax Number" name="serviceTaxNumber" value={formData.serviceTaxNumber} onChange={handleChange} placeholder="Enter service tax number" />
                <FormInput label="P.A.N." name="pan" value={formData.pan} onChange={handleChange} placeholder="Enter P.A.N. number" />
                <FormInput label="Aadhaar Number" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} placeholder="Enter Aadhaar number" />
                <FormInput label="GSTIN" name="gstin" value={formData.gstin} onChange={handleChange} placeholder="Enter GSTIN" />
                <FormInput label="Address Line 1" name="addressLine1" value={formData.addressLine1} onChange={handleChange} placeholder="Enter address line 1" />
                <FormInput label="Address Line 2" name="addressLine2" value={formData.addressLine2} onChange={handleChange} placeholder="Enter address line 2" />
                <FormInput label="State" name="state" value={formData.state} onChange={handleChange} placeholder="Enter state" />
                <FormInput label="Zip Code" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Enter zip code" />
                </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
                <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors flex items-center"
                >
                <X size={18} className="mr-2" />
                Cancel
                </button>
                <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 shadow-md transition-all flex items-center disabled:bg-purple-400 disabled:cursor-not-allowed"
                >
                {status === 'loading' && <RefreshCw className="animate-spin mr-2" size={16} />}
                Save Changes
                </button>
            </div>
            </div>
        </form>
      );
    }
    return <ErrorState onRetry={() => dispatch(fetchOrganizationSettings())} error="No organization settings were found." />;
  };

  return (
    <div className="w-full">
      <header className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Organization Settings</h1>
          <nav aria-label="Breadcrumb" className="mt-1">
            <ol className="flex items-center space-x-2 text-sm">
            
              <li>
                <Link to="/getting-started" className="text-gray-500 hover:text-gray-700">
                  Getting Started
                </Link>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li>
                <span className="text-gray-900 font-medium">Organization Settings</span>
              </li>
            </ol>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default OrganizationSettingsPage;

