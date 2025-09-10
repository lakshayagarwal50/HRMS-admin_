// import React, { useState, useEffect, useCallback } from 'react';
// import { MoreHorizontal } from 'lucide-react';
// import { useSelector, useDispatch } from 'react-redux';
// import type { AppDispatch, RootState } from '../../store/store';
// import { fetchRatingScales, updateRatingScale, type RatingScale } from '../../store/slice/ratingScaleSlice';

// const SkeletonRow: React.FC = () => (
//     <div className="grid grid-cols-12 gap-4 items-center animate-pulse">
//         <div className="col-span-1"><div className="h-4 bg-gray-200 rounded w-1/2"></div></div>
//         <div className="col-span-8"><div className="h-9 bg-gray-200 rounded"></div></div>
//         <div className="col-span-3 flex justify-end"><div className="h-8 w-8 bg-gray-200 rounded-full"></div></div>
//     </div>
// );

// const ScaleRow = React.memo(({ scale, onDescriptionChange, onSave, onToggleDropdown, isActive }: {
//     scale: RatingScale;
//     onDescriptionChange: (scaleId: string, value: string) => void;
//     onSave: (scaleId: string) => void;
//     onToggleDropdown: (id: string) => void;
//     isActive: boolean;
// }) => {
//     return (
//         <div className="grid grid-cols-12 gap-4 items-center">
//             <div className="col-span-1 text-sm text-gray-600">{scale.scaleId}</div>
//             <div className="col-span-8">
//                 <input
//                     type="text"
//                     value={scale.description}
//                     onChange={(e) => onDescriptionChange(scale.scaleId, e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
//                 />
//             </div>
//             <div className="col-span-3 flex justify-end relative">
//                 <button onClick={() => onToggleDropdown(`scale-${scale.id}`)} className="p-2 rounded-full hover:bg-gray-200">
//                     <MoreHorizontal size={20} className="text-gray-500" />
//                 </button>
//                 {isActive && (
//                     <div className="absolute top-full right-0 mt-2 w-28 bg-white border rounded-md shadow-lg z-10">
//                         <button onClick={() => onSave(scale.scaleId)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Save</button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// });


// const RatingScaleComponent: React.FC = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const { data: scales, status, error } = useSelector((state: RootState) => state.ratingScale);
//     const [localScales, setLocalScales] = useState(scales);
//     const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

//     useEffect(() => {
//         if (status === 'idle') {
//             dispatch(fetchRatingScales());
//         }
//     }, [status, dispatch]);

//     useEffect(() => {
//         setLocalScales(scales);
//     }, [scales]);

  
//     const handleScaleChange = useCallback((scaleId: string, value: string) => {
//         setLocalScales(currentScales => currentScales.map(s => s.scaleId === scaleId ? { ...s, description: value } : s));
//     }, []);

//     const handleSaveScale = useCallback((scaleId: string) => {
//         const scaleToUpdate = localScales.find(s => s.scaleId === scaleId);
//         if (scaleToUpdate) {
//             dispatch(updateRatingScale({ scaleId: scaleToUpdate.scaleId, description: scaleToUpdate.description }));
//         }
//         setActiveDropdown(null);
//     }, [dispatch, localScales]);

//     const toggleDropdown = useCallback((id: string) => {
//         setActiveDropdown(prev => (prev === id ? null : id));
//     }, []);
    
 
//     const renderContent = () => {
//         if (status === 'loading' || status === 'idle') {
//             return <div className="space-y-4">{[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}</div>;
//         }

//         if (status === 'failed') {
//             return <p className="text-red-500">Error: {error}</p>;
//         }

//         if (status === 'succeeded') {
//             return (
//                 <div className="space-y-4">
//                     {localScales.map((scale) => (
//                         <ScaleRow
//                             key={scale.id}
//                             scale={scale}
//                             onDescriptionChange={handleScaleChange}
//                             onSave={handleSaveScale}
//                             onToggleDropdown={toggleDropdown}
//                             isActive={activeDropdown === `scale-${scale.id}`}
//                         />
//                     ))}
//                 </div>
//             );
//         }
//         return null;
//     };

//     return (
//         <div className="bg-white p-6 rounded-lg shadow-md border">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">Rating Scale</h2>
//             <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 mb-4">
//                 <div className="col-span-1">S.no</div>
//                 <div className="col-span-8">Rating scale</div>
//                 <div className="col-span-3 text-right pr-2">Action</div>
//             </div>
//             {renderContent()}
//         </div>
//     );
// };

// export default RatingScaleComponent;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import {
  fetchRatingScales,
  updateRatingScale,
  type RatingScale,
} from '../../store/slice/ratingScaleSlice';
import { z } from 'zod';
import { Toaster, toast } from 'react-hot-toast';

// ✅ Zod schema validation: only letters & spaces
const descriptionSchema = z
  .string()
  .trim()
  .min(1, { message: 'Required' })
  .regex(/^[A-Za-z ]+$/, { message: 'Only letters and spaces allowed' });

type ValidationErrors = Record<string, string | null>;

const SkeletonRow: React.FC = () => (
  <div className="grid grid-cols-12 gap-4 items-center animate-pulse">
    <div className="col-span-1">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
    <div className="col-span-8">
      <div className="h-9 bg-gray-200 rounded"></div>
    </div>
    <div className="col-span-3 flex justify-end">
      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

const ScaleRow = React.memo(
  ({
    scale,
    onDescriptionChange,
    onSave,
    onToggleDropdown,
    isActive,
    error,
    disabled,
  }: {
    scale: RatingScale;
    onDescriptionChange: (scaleId: string, value: string) => void;
    onSave: (scaleId: string) => void;
    onToggleDropdown: (id: string) => void;
    isActive: boolean;
    error?: string | null;
    disabled?: boolean;
  }) => {
    return (
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-1 text-sm text-gray-600">{scale.scaleId}</div>
        <div className="col-span-8">
          <input
            type="text"
            value={scale.description}
            onChange={(e) =>
              onDescriptionChange(scale.scaleId, e.target.value)
            }
            className={`w-full px-3 py-2 border rounded-md shadow-sm text-sm ${
              error
                ? 'border-red-400 focus:border-red-500'
                : 'border-gray-300'
            }`}
            placeholder="Enter rating scale description"
            aria-invalid={!!error}
            aria-describedby={error ? `err-${scale.scaleId}` : undefined}
          />
          {error && (
            <p
              id={`err-${scale.scaleId}`}
              className="mt-1 text-xs text-red-500"
            >
              {error}
            </p>
          )}
        </div>
        <div className="col-span-3 flex justify-end relative">
          <button
            onClick={() => onToggleDropdown(`scale-${scale.id}`)}
            className="p-2 rounded-full hover:bg-gray-200"
            aria-haspopup="menu"
            aria-expanded={isActive}
          >
            <MoreHorizontal size={20} className="text-gray-500" />
          </button>
          {isActive && (
            <div className="absolute top-full right-0 mt-2 w-28 bg-white border rounded-md shadow-lg z-10">
              <button
                onClick={() => onSave(scale.scaleId)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  disabled
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                disabled={disabled}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

const RatingScaleComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: scales, status, error } = useSelector(
    (state: RootState) => state.ratingScale
  );

  const [localScales, setLocalScales] = useState<RatingScale[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Fetch data on mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRatingScales());
    }
  }, [status, dispatch]);

  // Keep local copy of scales
  useEffect(() => {
    setLocalScales(scales ?? []);
    setErrors({});
  }, [scales]);

  const originalsById = useMemo(() => {
    const map = new Map<string, RatingScale>();
    (scales ?? []).forEach((s) => map.set(s.scaleId, s));
    return map;
  }, [scales]);

  const validateOne = useCallback((scaleId: string, value: string) => {
    const r = descriptionSchema.safeParse(value);
    setErrors((prev) => ({
      ...prev,
      [scaleId]: r.success
        ? null
        : r.error.issues[0]?.message || 'Invalid',
    }));
    return r.success;
  }, []);

  const handleScaleChange = useCallback(
    (scaleId: string, value: string) => {
      setLocalScales((current) =>
        current.map((s) =>
          s.scaleId === scaleId ? { ...s, description: value } : s
        )
      );
      validateOne(scaleId, value);
    },
    [validateOne]
  );

  const handleSaveScale = useCallback(
    async (scaleId: string) => {
      const scaleToUpdate = localScales.find(
        (s) => s.scaleId === scaleId
      );
      if (!scaleToUpdate) return;

      // Validate before saving
      const isValid = validateOne(
        scaleId,
        scaleToUpdate.description
      );
      if (!isValid) {
        toast.error('Please fix validation errors before saving');
        setActiveDropdown(null);
        return;
      }

      try {
        await dispatch(
          updateRatingScale({
            scaleId: scaleToUpdate.scaleId,
            description: scaleToUpdate.description.trim(),
          })
        ).unwrap();

        toast.success('Rating scale updated');
      } catch (e: any) {
        const msg = e?.message || 'Failed to update';
        toast.error(msg);
      } finally {
        setActiveDropdown(null);
      }
    },
    [dispatch, localScales, validateOne]
  );

  const toggleDropdown = useCallback((id: string) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  }, []);

  // Disable save if unchanged or invalid
  const isDisabled = useCallback(
    (s: RatingScale) => {
      const original = originalsById.get(s.scaleId);
      const unchanged =
        original?.description?.trim() === s.description?.trim();
      const hasError = !!errors[s.scaleId];
      return unchanged || hasError;
    },
    [errors, originalsById]
  );

  const renderContent = () => {
    if (status === 'loading' || status === 'idle') {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      );
    }

    if (status === 'failed') {
      // Inline error (no toast here to avoid duplicates)
      return (
        <p className="text-red-500">
          Failed to load rating scales: {String(error)}
        </p>
      );
    }

    if (status === 'succeeded') {
      return (
        <div className="space-y-4">
          {localScales.map((scale) => (
            <ScaleRow
              key={scale.id}
              scale={scale}
              onDescriptionChange={handleScaleChange}
              onSave={handleSaveScale}
              onToggleDropdown={toggleDropdown}
              isActive={activeDropdown === `scale-${scale.id}`}
              error={errors[scale.scaleId]}
              disabled={isDisabled(scale)}
            />
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      {/* ✅ Toaster with top-center position */}
      <Toaster position="top-center" />

      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Rating Scale
      </h2>
      <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 mb-4">
        <div className="col-span-1">S.no</div>
        <div className="col-span-8">Rating scale</div>
        <div className="col-span-3 text-right pr-2">Action</div>
      </div>
      {renderContent()}
    </div>
  );
};

export default RatingScaleComponent;
