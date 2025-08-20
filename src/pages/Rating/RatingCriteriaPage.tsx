import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MoreHorizontal } from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface RatingScale {
  id: number;
  label: string;
}

interface Criteria {
  id: number;
  name: string;
}

// --- MOCK DATA ---
const initialRatingScales: RatingScale[] = [
  { id: 1, label: 'Non effective performer' },
  { id: 2, label: 'Minimal effective performer' },
  { id: 3, label: 'Effective performer' },
  { id: 4, label: 'Highly effective performer' },
  { id: 5, label: 'Exceptional performer' },
];

const initialCriteria: Criteria[] = [
  { id: 1, name: 'Clear goals' },
  { id: 2, name: 'Conflicts well managed' },
  { id: 3, name: 'Accountability' },
  { id: 4, name: 'Teamwork' },
  { id: 5, name: 'Technical skills' },
  { id: 6, name: 'Communication levels' },
];

// --- MAIN COMPONENT ---
const RatingCriteriaPage: React.FC = () => {
  const [ratingScales, setRatingScales] = useState(initialRatingScales);
  const [criteria, setCriteria] = useState(initialCriteria);
  const [newCriteriaName, setNewCriteriaName] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleScaleChange = (id: number, value: string) => {
    setRatingScales(scales => scales.map(scale => scale.id === id ? { ...scale, label: value } : scale));
  };

  const handleSaveScale = (id: number) => {
    // In a real app, you would make an API call here to save the changes.
    console.log(`Saving scale ${id}:`, ratingScales.find(s => s.id === id)?.label);
    setActiveDropdown(null); // Close dropdown after saving
  };

  const handleAddCriteria = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCriteriaName.trim()) {
      const newCriterion: Criteria = {
        id: Math.max(0, ...criteria.map(c => c.id)) + 1,
        name: newCriteriaName.trim(),
      };
      setCriteria(prev => [...prev, newCriterion]);
      setNewCriteriaName('');
    }
  };
  
  const handleDeleteCriteria = (id: number) => {
      setCriteria(prev => prev.filter(c => c.id !== id));
      setActiveDropdown(null);
  };

  const toggleDropdown = (id: string) => {
    setActiveDropdown(prev => (prev === id ? null : id));
  };

  return (
    <div className="w-full bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Rating criteria & scale</h1>
          <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-500">
            <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
            <ChevronRight size={16} className="mx-1" />
            <span className="font-medium text-gray-600">Rating</span>
             <ChevronRight size={16} className="mx-1" />
            <span className="font-medium text-gray-800">Rating criteria & scale</span>
          </nav>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Scales and Criteria */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Rating Scale Section */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Rating Scale</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                <div className="col-span-1">S.no</div>
                <div className="col-span-8">Rating scale</div>
                <div className="col-span-3 text-right pr-2">Action</div>
              </div>
              {ratingScales.map((scale) => (
                <div key={scale.id} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1 text-sm text-gray-600">{scale.id}</div>
                  <div className="col-span-8">
                    <input
                      type="text"
                      value={scale.label}
                      onChange={(e) => handleScaleChange(scale.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                    />
                  </div>
                  <div className="col-span-3 flex justify-end relative">
                     <button onClick={() => toggleDropdown(`scale-${scale.id}`)} className="p-2 rounded-full hover:bg-gray-200">
                        <MoreHorizontal size={20} className="text-gray-500" />
                    </button>
                    {activeDropdown === `scale-${scale.id}` && (
                        <div className="absolute top-full right-0 mt-2 w-28 bg-white border rounded-md shadow-lg z-10">
                           <button onClick={() => handleSaveScale(scale.id)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Save</button>
                        </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Criteria Section */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Criteria</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                <div className="col-span-1">S.no</div>
                <div className="col-span-8">Criteria</div>
                <div className="col-span-3 text-right pr-2">Action</div>
              </div>
              {criteria.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1 text-sm text-gray-600">{index + 1}</div>
                  <div className="col-span-8 text-sm text-gray-800 font-medium">{item.name}</div>
                  <div className="col-span-3 flex justify-end relative">
                     <button onClick={() => toggleDropdown(`criteria-${item.id}`)} className="p-2 rounded-full hover:bg-gray-200">
                        <MoreHorizontal size={20} className="text-gray-500" />
                    </button>
                     {activeDropdown === `criteria-${item.id}` && (
                        <div className="absolute top-full right-0 mt-2 w-28 bg-white border rounded-md shadow-lg z-10">
                           <button onClick={() => handleDeleteCriteria(item.id)} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Delete</button>
                        </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Add Criteria Form */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Add Criteria</h2>
          <form onSubmit={handleAddCriteria} className="space-y-6">
            <div>
              <label htmlFor="criteriaName" className="block text-sm font-medium text-gray-700 mb-1">Criteria Name</label>
              <input
                type="text"
                id="criteriaName"
                value={newCriteriaName}
                onChange={(e) => setNewCriteriaName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="flex justify-end gap-4 pt-2">
              <button type="button" onClick={() => setNewCriteriaName('')} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200">Cancel</button>
              <button type="submit" className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">SUBMIT</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RatingCriteriaPage;
