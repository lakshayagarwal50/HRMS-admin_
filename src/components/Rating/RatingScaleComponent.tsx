import React, { useState, useEffect, useCallback } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchRatingScales, updateRatingScale, type RatingScale } from '../../store/slice/ratingScaleSlice';

const SkeletonRow: React.FC = () => (
    <div className="grid grid-cols-12 gap-4 items-center animate-pulse">
        <div className="col-span-1"><div className="h-4 bg-gray-200 rounded w-1/2"></div></div>
        <div className="col-span-8"><div className="h-9 bg-gray-200 rounded"></div></div>
        <div className="col-span-3 flex justify-end"><div className="h-8 w-8 bg-gray-200 rounded-full"></div></div>
    </div>
);

const ScaleRow = React.memo(({ scale, onDescriptionChange, onSave, onToggleDropdown, isActive }: {
    scale: RatingScale;
    onDescriptionChange: (scaleId: string, value: string) => void;
    onSave: (scaleId: string) => void;
    onToggleDropdown: (id: string) => void;
    isActive: boolean;
}) => {
    return (
        <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-1 text-sm text-gray-600">{scale.scaleId}</div>
            <div className="col-span-8">
                <input
                    type="text"
                    value={scale.description}
                    onChange={(e) => onDescriptionChange(scale.scaleId, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                />
            </div>
            <div className="col-span-3 flex justify-end relative">
                <button onClick={() => onToggleDropdown(`scale-${scale.id}`)} className="p-2 rounded-full hover:bg-gray-200">
                    <MoreHorizontal size={20} className="text-gray-500" />
                </button>
                {isActive && (
                    <div className="absolute top-full right-0 mt-2 w-28 bg-white border rounded-md shadow-lg z-10">
                        <button onClick={() => onSave(scale.scaleId)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Save</button>
                    </div>
                )}
            </div>
        </div>
    );
});


const RatingScaleComponent: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data: scales, status, error } = useSelector((state: RootState) => state.ratingScale);
    const [localScales, setLocalScales] = useState(scales);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchRatingScales());
        }
    }, [status, dispatch]);

    useEffect(() => {
        setLocalScales(scales);
    }, [scales]);

  
    const handleScaleChange = useCallback((scaleId: string, value: string) => {
        setLocalScales(currentScales => currentScales.map(s => s.scaleId === scaleId ? { ...s, description: value } : s));
    }, []);

    const handleSaveScale = useCallback((scaleId: string) => {
        const scaleToUpdate = localScales.find(s => s.scaleId === scaleId);
        if (scaleToUpdate) {
            dispatch(updateRatingScale({ scaleId: scaleToUpdate.scaleId, description: scaleToUpdate.description }));
        }
        setActiveDropdown(null);
    }, [dispatch, localScales]);

    const toggleDropdown = useCallback((id: string) => {
        setActiveDropdown(prev => (prev === id ? null : id));
    }, []);
    
 
    const renderContent = () => {
        if (status === 'loading' || status === 'idle') {
            return <div className="space-y-4">{[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}</div>;
        }

        if (status === 'failed') {
            return <p className="text-red-500">Error: {error}</p>;
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
                        />
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Rating Scale</h2>
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
