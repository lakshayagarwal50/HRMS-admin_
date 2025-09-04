//imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import { axiosInstance } from "../../services";

// Interface
export interface AuditLog {
  id: string;
  activityTime: string;
  object: string;
  type: {
    name: string;
    severity: "Info" | "Warning" | "Error";
  };
  message: string;
  who: string;
}

interface AuditHistoryState {
  logs: AuditLog[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  totalItems: number; 
  totalPages: number; 
}

//initialstate
const initialState: AuditHistoryState = {
  logs: [],
  status: "idle",
  error: null,
  totalItems: 0,
  totalPages: 0,
};


interface FetchAuditHistoryResponse {
  logs: AuditLog[];
  totalItems: number;
  totalPages: number;
}

interface FetchAuditHistoryArgs {
  page: number;
  limit: number;
}

// thunk logic for api call
export const fetchAuditHistory = createAsyncThunk<
  FetchAuditHistoryResponse, 
  FetchAuditHistoryArgs,     
  { rejectValue: string }
>(
  "auditHistory/fetchHistory",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      
      const response = await axiosInstance.get(
        `/report/history?page=${page}&limit=${limit}`
      );
      
      const { history, total } = response.data; 

      
      const transformedHistory: AuditLog[] = history.map((log: any) => ({
        id: log.id,
        activityTime: log.time,
        object: log.object,
        message: log.message,
        who: log.who,
        type: {
          name: log.type,
          severity: "Info",
        },
      }));

      const totalPages = Math.ceil(total / limit);

      return { logs: transformedHistory, totalItems: total, totalPages };
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data?.message || "Failed to fetch audit history."
        );
      }
      return rejectWithValue("An unknown error occurred while fetching audit history.");
    }
  }
);


//slice
const auditHistorySlice = createSlice({
  name: "auditHistory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditHistory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      
      .addCase(fetchAuditHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.logs = action.payload.logs;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAuditHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.logs = []; 
        state.totalItems = 0;
        state.totalPages = 0;
      });
  },
});

export default auditHistorySlice.reducer;