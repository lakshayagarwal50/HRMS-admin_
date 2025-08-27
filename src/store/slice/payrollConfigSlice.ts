import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

// --- Base URL for the API endpoint ---
const API_BASE_URL = '/api/payrollConfiguration/';

// --- TYPE DEFINITIONS ---

// Shape of the raw data from the API
interface PayrollConfigFromAPI {
    amountRoundingOff: string;
    taxCalculationMode: string;
    payrollDaysMode: string;
    esicWagesMode: string;
    investmentWindowMonthly: { fromDay: number; toDay: number; };
    poiWindowFY: { from: string; to: string; };
}

// Shape of the data our UI components will use (flat structure)
export interface PayrollConfig {
    amountRounding: string;
    taxCalculationMode: string;
    daysInPayrollRun: string;
    esicWagesMode: string;
    investmentDeclarationFrom: string;
    investmentDeclarationTo: string;
    poiAttachmentFrom: string;
    poiAttachmentTo: string;
}

export interface PayrollConfigState {
  data: PayrollConfig | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PayrollConfigState = {
  data: null,
  status: 'idle',
  error: null,
};

// --- DATA TRANSFORMATION ---

// Maps the nested API response to the flat state structure our UI uses
const transformApiToState = (apiData: PayrollConfigFromAPI): PayrollConfig => ({
    amountRounding: apiData.amountRoundingOff,
    taxCalculationMode: apiData.taxCalculationMode,
    daysInPayrollRun: apiData.payrollDaysMode,
    esicWagesMode: apiData.esicWagesMode,
    investmentDeclarationFrom: String(apiData.investmentWindowMonthly.fromDay),
    investmentDeclarationTo: String(apiData.investmentWindowMonthly.toDay),
    poiAttachmentFrom: apiData.poiWindowFY.from,
    poiAttachmentTo: apiData.poiWindowFY.to,
});

// Maps our flat UI state back to the nested structure the API expects for updates
const transformStateToApi = (stateData: PayrollConfig): PayrollConfigFromAPI => ({
    amountRoundingOff: stateData.amountRounding,
    taxCalculationMode: stateData.taxCalculationMode,
    payrollDaysMode: stateData.daysInPayrollRun,
    esicWagesMode: stateData.esicWagesMode,
    investmentWindowMonthly: {
        fromDay: parseInt(stateData.investmentDeclarationFrom),
        toDay: parseInt(stateData.investmentDeclarationTo),
    },
    poiWindowFY: {
        from: stateData.poiAttachmentFrom,
        to: stateData.poiAttachmentTo,
    },
});


// --- ASYNC THUNKS ---
export const fetchPayrollConfig = createAsyncThunk(
    'payrollConfig/fetch', 
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}get`);
            // The API response is nested under a 'data' key
            return transformApiToState(response.data.data as PayrollConfigFromAPI);
        } catch (error) {
            if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch configuration');
            return rejectWithValue('An unknown error occurred.');
        }
    }
);

export const updatePayrollConfig = createAsyncThunk(
    'payrollConfig/update', 
    async (configData: PayrollConfig, { rejectWithValue }) => {
        try {
            const apiRequestBody = transformStateToApi(configData);
            await axiosInstance.put(`${API_BASE_URL}update`, apiRequestBody);
            // On success, return the original data to update the state
            return configData;
        } catch (error) {
            if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to update configuration');
            return rejectWithValue('An unknown error occurred.');
        }
    }
);

// --- SLICE DEFINITION ---
const payrollConfigSlice = createSlice({
  name: 'payrollConfig',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayrollConfig.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchPayrollConfig.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchPayrollConfig.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updatePayrollConfig.pending, (state) => { state.status = 'loading'; })
      .addCase(updatePayrollConfig.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(updatePayrollConfig.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default payrollConfigSlice.reducer;
