// // src/store/hooks.ts

// import { useDispatch, useSelector } from 'react-redux';
// import type { RootState, AppDispatch } from './store';

// // Use these typed hooks throughout your app instead of plain `useDispatch` and `useSelector`
// export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
// export const useAppSelector = useSelector.withTypes<RootState>();

// src/store/hooks.ts

import { useDispatch, useSelector } from 'react-redux';
import type {TypedUseSelectorHook} from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Typed versions of useDispatch and useSelector
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
