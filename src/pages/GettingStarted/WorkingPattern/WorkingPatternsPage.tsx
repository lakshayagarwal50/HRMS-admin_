// import React, { useState } from 'react';
// import { Plus } from 'lucide-react';

// // --- Import your reusable components ---
// import Table, { type Column } from '../../../components/common/Table';
// import CreateWorkingPattern from '../../../components/WorkingPattern/CreateWorkingPattern'; // Adjust path if needed
// import UpdateWorkingPattern from '../../../components/WorkingPattern//UpdateWorkingPattern'; // Adjust path if needed

// // --- TYPE DEFINITION ---
// interface WorkingPattern {
//   id: number;
//   code: string;
//   name: string;
//   week1: boolean[];
//   week2: boolean[];
//   week3: boolean[];
//   week4: boolean[];
// }

// // --- HELPER COMPONENTS & DATA ---
// const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
// const WeekDisplay: React.FC<{ pattern: boolean[] }> = ({ pattern }) => (
//   <div className="flex space-x-1">
//     {pattern.map((isWorking, index) => (
//       <span
//         key={index}
//         className={`flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded ${
//           isWorking ? 'bg-green-500' : 'bg-red-500'
//         }`}
//       >
//         {daysOfWeek[index]}
//       </span>
//     ))}
//   </div>
// );

// const samplePatterns: WorkingPattern[] = [
//   {
//     id: 1,
//     code: '123',
//     name: '5 day Week',
//     week1: [false, true, true, true, true, true, false],
//     week2: [false, true, true, true, true, true, false],
//     week3: [false, true, true, true, true, true, false],
//     week4: [false, true, true, true, true, true, false],
//   },
//   {
//     id: 2,
//     code: '456',
//     name: 'Alternate',
//     week1: [false, true, true, true, true, true, false],
//     week2: [true, false, false, false, false, false, true],
//     week3: [false, true, true, true, true, true, false],
//     week4: [true, false, false, false, false, false, true],
//   },
// ];

// // --- MAIN COMPONENT ---
// const WorkingPatternsPage: React.FC = () => {
//   const [isCreatePanelOpen, setCreatePanelOpen] = useState(false);
//   const [editingPattern, setEditingPattern] = useState<WorkingPattern | null>(null);

//   // Handler to open the update panel with the selected row's data
//   const handleEditClick = (pattern: WorkingPattern) => {
//     setEditingPattern(pattern);
//   };

//   // Define the columns for the generic Table component
//   const columns: Column<WorkingPattern>[] = [
//     { header: 'Code', key: 'code' },
//     { header: 'Name', key: 'name' },
//     { header: 'Week 1', key: 'week1', render: (row) => <WeekDisplay pattern={row.week1} /> },
//     { header: 'Week 2', key: 'week2', render: (row) => <WeekDisplay pattern={row.week2} /> },
//     { header: 'Week 3', key: 'week3', render: (row) => <WeekDisplay pattern={row.week3} /> },
//     { header: 'Week 4', key: 'week4', render: (row) => <WeekDisplay pattern={row.week4} /> },
//     {
//       header: 'Action',
//       key: 'action',
//       className: 'text-center',
//       render: (row) => (
//         <button
//           onClick={() => handleEditClick(row)} // Connect the edit handler here
//           className="font-medium text-purple-600 hover:text-purple-800"
//         >
//           Edit
//         </button>
//       ),
//     },
//   ];

//   return (
//     <div className="w-full">
//       {/* Page Header */}
//       <header className="bg-white shadow-sm mb-8">
//         <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Working Patterns</h1>
//             <nav aria-label="Breadcrumb" className="mt-1">
//               <ol className="flex items-center space-x-2 text-sm">
//                 <li><a href="/dashboard" className="text-gray-500 hover:text-gray-700">Dashboard</a></li>
//                 <li><span className="text-gray-500">/</span></li>
//                 <li><a href="/getting-started" className="text-gray-500 hover:text-gray-700">Getting Started</a></li>
//                 <li><span className="text-gray-500">/</span></li>
//                 <li><span className="text-gray-900 font-medium">Working Patterns</span></li>
//               </ol>
//             </nav>
//           </div>
//           <button
//             onClick={() => setCreatePanelOpen(true)} // This opens the "Create" panel
//             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
//           >
//             <Plus size={20} className="-ml-1 mr-2" />
//             ADD NEW
//           </button>
//         </div>
//       </header>

//       {/* Main Content Area */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <Table
//           columns={columns}
//           data={samplePatterns}
//           showSearch={false}
//           showPagination={false}
//         />
//       </main>
      
//       {/* Render the Create and Update Panels */}
//       <CreateWorkingPattern 
//         isOpen={isCreatePanelOpen} 
//         onClose={() => setCreatePanelOpen(false)} 
//       />
//       <UpdateWorkingPattern 
//         isOpen={!!editingPattern} 
//         onClose={() => setEditingPattern(null)} 
//         patternData={editingPattern} 
//       />
//     </div>
//   );
// };

// export default WorkingPatternsPage;

import React, { useState, useEffect, type ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Image, Loader2 } from 'lucide-react';

// --- Redux Imports ---
import {
  fetchOrganizationSettings,
  updateOrganizationSettings,
  type OrganizationSettings,
} from '../../../store/slice/organizationSlice'; // Adjust path as needed
import type { AppDispatch, RootState } from '../../../store/store'; // Adjust path as needed

// --- Reusable Form Input Component ---
const FormInput: React.FC<{
  label: string;
  name: keyof OrganizationSettings;
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
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 transition"
    />
  </div>
);

// --- Main Page Component ---
const OrganizationSettingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: orgData, status, error } = useSelector((state: RootState) => state.organizationSettings);

  // Local state for form fields, initialized from Redux store
  const [formData, setFormData] = useState<OrganizationSettings | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Fetch initial data when the component mounts
  useEffect(() => {
    dispatch(fetchOrganizationSettings());
  }, [dispatch]);

  // Populate local form state when data is fetched from Redux
  useEffect(() => {
    if (orgData) {
      setFormData(orgData);
      if (orgData.logoUrl) {
        setLogoPreview(orgData.logoUrl);
      }
    }
  }, [orgData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      // In a real app, you would handle the file upload first,
      // get the URL, and then update the settings.
      // For now, we'll just log it and dispatch the text data.
      console.log("Logo file to upload:", logoFile);
      dispatch(updateOrganizationSettings(formData));
    }
  };
  
  // Show a loading spinner while fetching data
  if (status === 'loading' && !formData) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-purple-600" size={48} />
      </div>
    );
  }

  // Show an error message if fetching fails
  if (status === 'failed') {
    return <div className="text-red-500 p-8">Error: {error}</div>;
  }
  
  // Render nothing if formData is not yet available
  if (!formData) {
      return null;
  }

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
        <form onSubmit={handleSubmit}>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Logo Section */}
              <div className="md:col-span-1">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Logo</h3>
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="w-40 h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-purple-500 hover:text-purple-500 transition">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Image size={48} />
                    )}
                  </div>
                </label>
                <input id="logo-upload" type="file" className="hidden" onChange={handleLogoChange} accept="image/*" />
              </div>

              {/* Form Fields Section */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <select id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 transition">
                    <option>Appinventiv</option>
                    <option>Another Company</option>
                  </select>
                </div>
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
            
            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
              <button type="button" className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={status === 'loading'} className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 shadow-md transition-all flex items-center disabled:bg-gray-400">
                {status === 'loading' && <Loader2 className="animate-spin mr-2" size={16} />}
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default OrganizationSettingsPage;

