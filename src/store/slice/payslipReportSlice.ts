

// import { createSlice, createAsyncThunk,type PayloadAction } from "@reduxjs/toolkit";
// import { axiosInstance } from "../../services";
// import { toast } from "react-toastify";

// // ----------------- TYPE DEFINITIONS -----------------

// // For a single payslip component record
// interface PayslipComponent {
//   name: string;
//   emp_id: string;
//   status: "Active" | "Inactive";
//   phoneNum: string;
//   designation: string;
//   department: string;
//   location: string;
//   componentName: string;
//   code: string;
//   type: string;
//   amount: string | number;
// }

// // Interface for the raw API response (flat structure)
// interface PayslipComponentApiResponse {
//   templateId: string;
//   reportId?: string;
//   components: PayslipComponent[];
//   page: number;
//   limit: number;
//   total: number;
// }

// // For the template data structure
// interface PayslipTemplate {
//   [key: string]: boolean;
// }

// // For the slice's state (with nested pagination)
// interface PayslipReportState {
//   components: PayslipComponent[];
//   template: PayslipTemplate | null;
//   reportId: string | null;
//   templateId: string | null;
//   pagination: {
//     totalItems: number;
//     totalPages: number;
//     currentPage: number;
//     limit: number;
//   } | null;
//   loading: boolean;
//   error: string | null;
// }

// // ----------------- INITIAL STATE -----------------

// const initialState: PayslipReportState = {
//   components: [],
//   template: null,
//   reportId: null,
//   templateId: null,
//   pagination: null,
//   loading: false,
//   error: null,
// };

// // ----------------- ASYNC THUNKS -----------------

// export const fetchPayslipComponentReports = createAsyncThunk(
//   "payslipReport/fetchAll",
//   async (
//     {
//       page = 1,
//       limit = 10,
//       filter = "",
//     }: { page?: number; limit?: number; filter?: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const { data } = await axiosInstance.get<PayslipComponentApiResponse>(
//         `/report/getAll/component/payslipComponent`,
//         {
//           params: { page, limit, filter },
//         }
//       );
//       const transformedPagination = {
//         totalItems: data.total,
//         currentPage: data.page,
//         limit: data.limit,
//         totalPages: Math.ceil(data.total / data.limit),
//       };
      
//       return {
//         components: data.components,
//         templateId: data.templateId,
//         reportId: data.reportId || null,
//         pagination: transformedPagination,
//       };
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to fetch reports");
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch reports"
//       );
//     }
//   }
// );

// export const fetchPayslipTemplateById = createAsyncThunk(
//   "payslipReport/fetchTemplate",
//   async (templateId: string, { rejectWithValue }) => {
//     try {
//       const { data } = await axiosInstance.get(
//         `/report/getTemplate/${templateId}`
//       );
//       return data as PayslipTemplate;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch template"
//       );
//     }
//   }
// );

// export const updatePayslipTemplate = createAsyncThunk(
//   "payslipReport/updateTemplate",
//   async (
//     {
//       templateId,
//       templateData,
//     }: { templateId: string; templateData: PayslipTemplate },
//     { dispatch, rejectWithValue } // <-- Added 'dispatch' here
//   ) => {
//     try {
//       // The API response is just a success message, so we don't need to capture it.
//       await axiosInstance.patch(
//         `/report/updateTemplate/component/${templateId}`,
//         templateData
//       );
//       toast.success("Template updated successfully");

//       // --- NEW LOGIC ---
//       // After a successful update, automatically refetch the data.
//       // 1. Refetch the template itself to get the latest version.
//       dispatch(fetchPayslipTemplateById(templateId));
//       // 2. Refetch the main report list.
//       dispatch(fetchPayslipComponentReports({}));

//       return { success: true }; // Return a simple success object.

//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to update template");
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to update template"
//       );
//     }
//   }
// );

// export const deletePayslipReport = createAsyncThunk(
//   "payslipReport/delete",
//   async (reportId: string, { dispatch, rejectWithValue }) => {
//     try {
//       await axiosInstance.delete(`/report/delete/${reportId}`);
//       toast.success("Report deleted successfully");
//       dispatch(fetchPayslipComponentReports({}));
//       return reportId;
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to delete report");
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to delete report"
//       );
//     }
//   }
// );

// export const downloadPayslipReport = createAsyncThunk(
//   "payslipReport/download",
//   async (
//     { format }: { format: "csv" | "excel" },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axiosInstance.get(
//         `/report/export/payslipComponent`,
//         {
//           params: { format },
//           responseType: "blob",
//         }
//       );

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       const extension = format === "excel" ? "xlsx" : "csv";
//       link.setAttribute("download", `payslip-component-report.${extension}`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       toast.success(`Report download started as ${format.toUpperCase()}`);
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Download failed");
//       return rejectWithValue(
//         error.response?.data?.message || "Download failed"
//       );
//     }
//   }
// );

// // ----------------- SLICE DEFINITION -----------------

// const payslipReportSlice = createSlice({
//   name: "payslipReport",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Fetch All Reports
//       .addCase(fetchPayslipComponentReports.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPayslipComponentReports.fulfilled, (state, action) => {
//         state.loading = false;
//         state.components = action.payload.components;
//         state.pagination = action.payload.pagination;
//         state.reportId = action.payload.reportId;
//         state.templateId = action.payload.templateId;
//       })
//       .addCase(fetchPayslipComponentReports.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//         state.components = [];
//         state.pagination = null;
//       })
//       // Fetch Template By ID
//       .addCase(fetchPayslipTemplateById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(
//         fetchPayslipTemplateById.fulfilled,
//         (state, action: PayloadAction<PayslipTemplate>) => {
//           state.loading = false;
//           state.template = action.payload;
//         }
//       )
//       .addCase(fetchPayslipTemplateById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Update Template - Doesn't need to change state directly,
//       // as the dispatched fetch actions will handle it.
//       .addCase(updatePayslipTemplate.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(updatePayslipTemplate.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(updatePayslipTemplate.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addMatcher(
//         (action) =>
//           [
//             deletePayslipReport.pending.type,
//             downloadPayslipReport.pending.type,
//           ].includes(action.type),
//         (state) => {
//           state.loading = true;
//         }
//       )
//       .addMatcher(
//         (action) =>
//           [
//             deletePayslipReport.fulfilled.type,
//             deletePayslipReport.rejected.type,
//             downloadPayslipReport.fulfilled.type,
//             downloadPayslipReport.rejected.type,
//           ].includes(action.type),
//         (state) => {
//           state.loading = false;
//         }
//       );
//   },
// });

// export default payslipReportSlice.reducer;


// import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
// import { axiosInstance } from "../../services";
// import { toast } from "react-toastify";
// import type { RootState } from "../store";

// // ----------------- TYPE DEFINITIONS -----------------

// // For a single payslip component record
// interface PayslipComponent {
//   name: string;
//   emp_id: string;
//   status: "Active" | "Inactive";
//   phoneNum: string;
//   designation: string;
//   department: string;
//   location: string;
//   componentName: string;
//   code: string;
//   type: string;
//   amount: string | number;
// }

// // Interface for the raw API response (flat structure)
// interface PayslipComponentApiResponse {
//   templateId: string;
//   reportId?: string;
//   components: PayslipComponent[];
//   page: number;
//   limit: number;
//   total: number;
// }

// // For the template data structure
// interface PayslipTemplate {
//   [key: string]: boolean;
// }

// // For the slice's state (with nested pagination)
// interface PayslipReportState {
//   components: PayslipComponent[];
//   template: PayslipTemplate | null;
//   reportId: string | null;
//   templateId: string | null;
//   pagination: {
//     totalItems: number;
//     totalPages: number;
//     currentPage: number;
//     limit: number;
//   } | null;
//   loading: boolean;
//   error: string | null;
// }

// // ----------------- INITIAL STATE -----------------

// const initialState: PayslipReportState = {
//   components: [],
//   template: null,
//   reportId: null,
//   templateId: null,
//   pagination: null,
//   loading: false,
//   error: null,
// };

// // ----------------- ASYNC THUNKS -----------------

// export const fetchPayslipComponentReports = createAsyncThunk(
//   "payslipReport/fetchAll",
//   async (
//     {
//       page = 1,
//       limit = 10,
//       filter = "",
//     }: { page?: number; limit?: number; filter?: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const { data } = await axiosInstance.get<PayslipComponentApiResponse>(
//         `/report/getAll/component/payslipComponent`,
//         {
//           params: { page, limit, search: filter },
//         }
//       );
//       const transformedPagination = {
//         totalItems: data.total,
//         currentPage: data.page,
//         limit: data.limit,
//         totalPages: Math.ceil(data.total / data.limit),
//       };

//       return {
//         components: data.components,
//         templateId: data.templateId,
//         reportId: data.reportId || null,
//         pagination: transformedPagination,
//       };
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to fetch reports");
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch reports"
//       );
//     }
//   }
// );

// export const fetchPayslipTemplateById = createAsyncThunk(
//   "payslipReport/fetchTemplate",
//   async (templateId: string, { rejectWithValue }) => {
//     try {
//       const { data } = await axiosInstance.get(
//         `/report/getTemplate/${templateId}`
//       );
//       return data as PayslipTemplate;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch template"
//       );
//     }
//   }
// );

// export const updatePayslipTemplate = createAsyncThunk<
//   { success: boolean },
//   { templateId: string; templateData: PayslipTemplate },
//   { dispatch: any; rejectWithValue: any; state: RootState }
// >(
//   "payslipReport/updateTemplate",
//   async (
//     { templateId, templateData },
//     { dispatch, rejectWithValue, getState }
//   ) => {
//     try {
//       await axiosInstance.patch(
//         `/report/updateTemplate/component/${templateId}`,
//         templateData
//       );
//       toast.success("Template updated successfully");

//       const currentFilter = (getState().payslipReport.pagination as any)?.filter || "";
//       dispatch(fetchPayslipComponentReports({ filter: currentFilter }));

//       return { success: true };
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to update template");
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to update template"
//       );
//     }
//   }
// );

// export const deletePayslipReport = createAsyncThunk<
//   string,
//   string,
//   { dispatch: any; rejectWithValue: any; state: RootState }
// >(
//   "payslipReport/delete",
//   async (reportId, { dispatch, rejectWithValue, getState }) => {
//     try {
//       await axiosInstance.delete(`/report/delete/${reportId}`);
//       toast.success("Report deleted successfully");
//       const currentFilter = (getState().payslipReport.pagination as any)?.filter || "";
//       dispatch(fetchPayslipComponentReports({ filter: currentFilter }));
//       return reportId;
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to delete report");
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to delete report"
//       );
//     }
//   }
// );

// export const downloadPayslipReport = createAsyncThunk(
//   "payslipReport/download",
//   async ({ format }: { format: "csv" | "excel" }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(
//         `/report/export/payslipComponent`,
//         {
//           params: { format },
//           responseType: "blob",
//         }
//       );

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       const extension = format === "excel" ? "xlsx" : "csv";
//       link.setAttribute("download", `payslip-component-report.${extension}`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       toast.success(`Report download started as ${format.toUpperCase()}`);
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Download failed");
//       return rejectWithValue(
//         error.response?.data?.message || "Download failed"
//       );
//     }
//   }
// );

// // ----------------- SLICE DEFINITION -----------------

// const payslipReportSlice = createSlice({
//   name: "payslipReport",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchPayslipComponentReports.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPayslipComponentReports.fulfilled, (state, action) => {
//         state.loading = false;
//         state.components = action.payload.components;
//         state.pagination = action.payload.pagination;
//         state.reportId = action.payload.reportId;
//         state.templateId = action.payload.templateId;
//       })
//       .addCase(fetchPayslipComponentReports.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//         state.components = [];
//         state.pagination = null;
//       })
//       .addCase(fetchPayslipTemplateById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(
//         fetchPayslipTemplateById.fulfilled,
//         (state, action: PayloadAction<PayslipTemplate>) => {
//           state.loading = false;
//           state.template = action.payload;
//         }
//       )
//       .addCase(fetchPayslipTemplateById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(updatePayslipTemplate.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(updatePayslipTemplate.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(updatePayslipTemplate.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addMatcher(
//         (action) =>
//           [
//             deletePayslipReport.pending.type,
//             downloadPayslipReport.pending.type,
//           ].includes(action.type),
//         (state) => {
//           state.loading = true;
//         }
//       )
//       .addMatcher(
//         (action) =>
//           [
//             deletePayslipReport.fulfilled.type,
//             deletePayslipReport.rejected.type,
//             downloadPayslipReport.fulfilled.type,
//             downloadPayslipReport.rejected.type,
//           ].includes(action.type),
//         (state) => {
//           state.loading = false;
//         }
//       );
//   },
// });

// export default payslipReportSlice.reducer;

// import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
// import { axiosInstance } from "../../services";
// import { toast } from "react-toastify";
// import type { RootState } from "../store";

// // ----------------- TYPE DEFINITIONS -----------------

// // For a single payslip component record
// interface PayslipComponent {
//   name: string;
//   emp_id: string;
//   status: "Active" | "Inactive";
//   phoneNum: string;
//   designation: string;
//   department: string;
//   location: string;
//   componentName: string;
//   code: string;
//   type: string;
//   amount: string | number;
// }

// // Interface for the raw API response (flat structure)
// interface PayslipComponentApiResponse {
//   templateId: string;
//   reportId?: string;
//   components: PayslipComponent[];
//   page: number;
//   limit: number;
//   total: number;
// }

// // For the template data structure
// interface PayslipTemplate {
//   [key: string]: boolean;
// }

// // For the slice's state (with nested pagination)
// interface PayslipReportState {
//   components: PayslipComponent[];
//   template: PayslipTemplate | null;
//   reportId: string | null;
//   templateId: string | null;
//   pagination: {
//     totalItems: number;
//     totalPages: number;
//     currentPage: number;
//     limit: number;
//   } | null;
//   loading: boolean;
//   error: string | null;
//   templateLoading: boolean; // 💡 Added new state for template loading
//   templateError: string | null; // 💡 Added new state for template error
// }

// // ----------------- INITIAL STATE -----------------

// const initialState: PayslipReportState = {
//   components: [],
//   template: null,
//   reportId: null,
//   templateId: null,
//   pagination: null,
//   loading: false,
//   error: null,
//   templateLoading: false, // 💡 Initialized new state
//   templateError: null, // 💡 Initialized new state
// };

// // ----------------- ASYNC THUNKS -----------------

// export const fetchPayslipComponentReports = createAsyncThunk(
//   "payslipReport/fetchAll",
//   async (
//     {
//       page = 1,
//       limit = 10,
//       filter = "",
//     }: { page?: number; limit?: number; filter?: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const { data } = await axiosInstance.get<PayslipComponentApiResponse>(
//         `/report/getAll/component/payslipComponent`,
//         {
//           params: { page, limit, search: filter },
//         }
//       );
//       const transformedPagination = {
//         totalItems: data.total,
//         currentPage: data.page,
//         limit: data.limit,
//         totalPages: Math.ceil(data.total / data.limit),
//       };

//       return {
//         components: data.components,
//         templateId: data.templateId,
//         reportId: data.reportId || null,
//         pagination: transformedPagination,
//       };
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to fetch reports");
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch reports"
//       );
//     }
//   }
// );

// export const fetchPayslipTemplateById = createAsyncThunk(
//   "payslipReport/fetchTemplate",
//   async (templateId: string, { rejectWithValue }) => {
//     try {
//       const { data } = await axiosInstance.get(
//         `/report/getTemplate/${templateId}`
//       );
//       return data as PayslipTemplate;
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to fetch template");
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch template"
//       );
//     }
//   }
// );

// export const updatePayslipTemplate = createAsyncThunk<
//   { success: boolean },
//   { templateId: string; templateData: PayslipTemplate },
//   { dispatch: any; rejectWithValue: any; state: RootState }
// >(
//   "payslipReport/updateTemplate",
//   async (
//     { templateId, templateData },
//     { dispatch, rejectWithValue, getState }
//   ) => {
//     try {
//       await axiosInstance.patch(
//         `/report/updateTemplate/component/${templateId}`,
//         templateData
//       );
//       toast.success("Template updated successfully");

//       const currentFilter = (getState().payslipReport.pagination as any)?.filter || "";
//       dispatch(fetchPayslipComponentReports({ filter: currentFilter }));

//       return { success: true };
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to update template");
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to update template"
//       );
//     }
//   }
// );

// export const deletePayslipReport = createAsyncThunk<
//   string,
//   string,
//   { dispatch: any; rejectWithValue: any; state: RootState }
// >(
//   "payslipReport/delete",
//   async (reportId, { dispatch, rejectWithValue, getState }) => {
//     try {
//       await axiosInstance.delete(`/report/delete/${reportId}`);
//       toast.success("Report deleted successfully");
//       const currentFilter = (getState().payslipReport.pagination as any)?.filter || "";
//       dispatch(fetchPayslipComponentReports({ filter: currentFilter }));
//       return reportId;
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to delete report");
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to delete report"
//       );
//     }
//   }
// );

// export const downloadPayslipReport = createAsyncThunk(
//   "payslipReport/download",
//   async ({ format }: { format: "csv" | "excel" }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(
//         `/report/export/payslipComponent`,
//         {
//           params: { format },
//           responseType: "blob",
//         }
//       );

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       const extension = format === "excel" ? "xlsx" : "csv";
//       link.setAttribute("download", `payslip-component-report.${extension}`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       toast.success(`Report download started as ${format.toUpperCase()}`);
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Download failed");
//       return rejectWithValue(
//         error.response?.data?.message || "Download failed"
//       );
//     }
//   }
// );

// // ----------------- SLICE DEFINITION -----------------

// const payslipReportSlice = createSlice({
//   name: "payslipReport",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Fetch All Reports
//       .addCase(fetchPayslipComponentReports.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPayslipComponentReports.fulfilled, (state, action) => {
//         state.loading = false;
//         state.components = action.payload.components;
//         state.pagination = action.payload.pagination;
//         state.reportId = action.payload.reportId;
//         state.templateId = action.payload.templateId;
//       })
//       .addCase(fetchPayslipComponentReports.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//         state.components = [];
//         state.pagination = null;
//       })
//       // Fetch Template By ID
//       .addCase(fetchPayslipTemplateById.pending, (state) => {
//         state.templateLoading = true; // 💡 Separate loading state
//         state.templateError = null; // 💡 Separate error state
//       })
//       .addCase(
//         fetchPayslipTemplateById.fulfilled,
//         (state, action: PayloadAction<PayslipTemplate>) => {
//           state.templateLoading = false; // 💡 Separate loading state
//           state.template = action.payload;
//         }
//       )
//       .addCase(fetchPayslipTemplateById.rejected, (state, action) => {
//         state.templateLoading = false; // 💡 Separate loading state
//         state.templateError = action.payload as string; // 💡 Separate error state
//       })
//       // Update Template - Doesn't need to change state directly,
//       // as the dispatched fetch actions will handle it.
//       .addCase(updatePayslipTemplate.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(updatePayslipTemplate.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(updatePayslipTemplate.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Add matchers for consistent loading state on other async actions
//       .addMatcher(
//         (action) =>
//           [
//             deletePayslipReport.pending.type,
//             downloadPayslipReport.pending.type,
//           ].includes(action.type),
//         (state) => {
//           state.loading = true;
//         }
//       )
//       .addMatcher(
//         (action) =>
//           [
//             deletePayslipReport.fulfilled.type,
//             deletePayslipReport.rejected.type,
//             downloadPayslipReport.fulfilled.type,
//             downloadPayslipReport.rejected.type,
//           ].includes(action.type),
//         (state) => {
//           state.loading = false;
//         }
//       );
//   },
// });

// export default payslipReportSlice.reducer;


// import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
// import { axiosInstance } from "../../services";

// // ----------------- TYPE DEFINITIONS -----------------

// interface PayslipComponent {
//   name: string;
//   emp_id: string;
//   status: "Active" | "Inactive";
//   phoneNum: string;
//   designation: string;
//   department: string;
//   location: string;
//   componentName: string;
//   code: string;
//   type: string;
//   amount: string | number;
// }

// interface PayslipTemplate {
//   [key: string]: boolean;
// }

// interface PaginationInfo {
//   totalItems: number;
//   totalPages: number;
//   currentPage: number;
//   limit: number;
// }

// interface PayslipReportState {
//   components: PayslipComponent[];
//   template: PayslipTemplate | null;
//   reportId: string | null;
//   templateId: string | null;
//   pagination: PaginationInfo | null;
//   loading: "idle" | "pending" | "succeeded" | "failed";
//   error: string | null;
//   templateLoading: "idle" | "pending" | "succeeded" | "failed";
//   templateError: string | null;
//   isDownloading: "csv" | "excel" | null;
//   isDeleting: boolean;
// }

// // ----------------- INITIAL STATE -----------------

// const initialState: PayslipReportState = {
//   components: [],
//   template: null,
//   reportId: null,
//   templateId: null,
//   pagination: null,
//   loading: "idle",
//   error: null,
//   templateLoading: "idle",
//   templateError: null,
//   isDownloading: null,
//   isDeleting: false,
// };

// // ----------------- ASYNC THUNKS -----------------

// export const fetchPayslipComponentReports = createAsyncThunk(
//   "payslipReport/fetchAll",
//   async ({ page = 1, limit = 10, filter = "" }: { page?: number; limit?: number; filter?: string }, { rejectWithValue }) => {
//     try {
//       const { data } = await axiosInstance.get(`/report/getAll/component/payslipComponent`, {
//         params: { page, limit, search: filter },
//       });
//       return data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch reports");
//     }
//   }
// );

// export const fetchPayslipTemplateById = createAsyncThunk(
//   "payslipReport/fetchTemplate",
//   async (templateId: string, { rejectWithValue }) => {
//     try {
//       const { data } = await axiosInstance.get(`/report/getTemplate/${templateId}`);
//       return data as PayslipTemplate;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch template");
//     }
//   }
// );

// export const updatePayslipTemplate = createAsyncThunk(
//   "payslipReport/updateTemplate",
//   async ({ templateId, templateData }: { templateId: string; templateData: PayslipTemplate }, { rejectWithValue }) => {
//     try {
//       await axiosInstance.patch(`/report/updateTemplate/component/${templateId}`, templateData);
//       return { success: true };
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "Failed to update template");
//     }
//   }
// );

// export const deletePayslipReport = createAsyncThunk(
//   "payslipReport/delete",
//   async (reportId: string, { dispatch, rejectWithValue }) => {
//     try {
//       await axiosInstance.delete(`/report/delete/${reportId}`);
//       // Re-fetch the data to reflect the deletion
//       dispatch(fetchPayslipComponentReports({}));
//       return reportId;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "Failed to delete report");
//     }
//   }
// );

// export const downloadPayslipReport = createAsyncThunk(
//   "payslipReport/download",
//   async ({ format }: { format: "csv" | "excel" }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(`/report/export/payslipComponent`, {
//         params: { format },
//         responseType: "blob",
//       });
//       return { data: response.data, format };
//     } catch (error: any) {
//       if (error.response?.data instanceof Blob && error.response.data.type.includes('json')) {
//         const errorText = await error.response.data.text();
//         const errorJson = JSON.parse(errorText);
//         return rejectWithValue(errorJson.message || 'Failed to download file.');
//       }
//       return rejectWithValue(error.response?.data?.message || "Download failed");
//     }
//   }
// );

// // ----------------- SLICE DEFINITION -----------------

// const payslipReportSlice = createSlice({
//   name: "payslipReport",
//   initialState,
//   reducers: {
//     clearPayslipReportError: (state) => {
//       state.error = null;
//       state.templateError = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch All Reports
//       .addCase(fetchPayslipComponentReports.pending, (state) => {
//         state.loading = "pending";
//         state.error = null;
//       })
//       .addCase(fetchPayslipComponentReports.fulfilled, (state, action) => {
//         state.loading = "succeeded";
//         state.components = action.payload.components;
//         state.reportId = action.payload.reportId || null;
//         state.templateId = action.payload.templateId;
//         state.pagination = {
//           totalItems: action.payload.total,
//           currentPage: action.payload.page,
//           limit: action.payload.limit,
//           totalPages: Math.ceil(action.payload.total / action.payload.limit),
//         };
//       })
//       .addCase(fetchPayslipComponentReports.rejected, (state, action) => {
//         state.loading = "failed";
//         state.error = action.payload as string;
//         state.components = [];
//         state.pagination = null;
//       })
//       // Fetch Template
//       .addCase(fetchPayslipTemplateById.pending, (state) => {
//         state.templateLoading = "pending";
//         state.templateError = null;
//       })
//       .addCase(fetchPayslipTemplateById.fulfilled, (state, action: PayloadAction<PayslipTemplate>) => {
//         state.templateLoading = "succeeded";
//         state.template = action.payload;
//       })
//       .addCase(fetchPayslipTemplateById.rejected, (state, action) => {
//         state.templateLoading = "failed";
//         state.templateError = action.payload as string;
//       })
//       // Update Template
//       .addCase(updatePayslipTemplate.pending, (state) => {
//         state.templateLoading = "pending";
//         state.templateError = null;
//       })
//       .addCase(updatePayslipTemplate.fulfilled, (state) => {
//         state.templateLoading = "succeeded";
//       })
//       .addCase(updatePayslipTemplate.rejected, (state, action) => {
//         state.templateLoading = "failed";
//         state.templateError = action.payload as string;
//       })
//       // Delete Report
//       .addCase(deletePayslipReport.pending, (state) => {
//         state.isDeleting = true;
//       })
//       .addCase(deletePayslipReport.fulfilled, (state) => {
//         state.isDeleting = false;
//       })
//       .addCase(deletePayslipReport.rejected, (state, action) => {
//         state.isDeleting = false;
//         state.error = action.payload as string;
//       })
//       // Download Report
//       .addCase(downloadPayslipReport.pending, (state, action) => {
//         state.isDownloading = action.meta.arg.format;
//       })
//       .addCase(downloadPayslipReport.fulfilled, (state, action) => {
//         const { data: blobData, format } = action.payload;
//         const url = window.URL.createObjectURL(new Blob([blobData]));
//         const link = document.createElement("a");
//         link.href = url;
//         const extension = format === "excel" ? "xlsx" : "csv";
//         link.setAttribute("download", `payslip-component-report.${extension}`);
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//         state.isDownloading = null;
//       })
//       .addCase(downloadPayslipReport.rejected, (state, action) => {
//         state.isDownloading = null;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearPayslipReportError } = payslipReportSlice.actions;
// export default payslipReportSlice.reducer;

import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "../../services";
import axios from "axios";

// ----------------- TYPE DEFINITIONS -----------------

interface PayslipComponent {
  name: string;
  emp_id: string;
  status: "Active" | "Inactive";
  phoneNum: string;
  designation: string;
  department: string;
  location: string;
  componentName: string;
  code: string;
  type: string;
  amount: string | number;
}

interface PayslipTemplate {
  [key: string]: boolean;
}

interface PaginationInfo {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

interface PayslipReportState {
  components: PayslipComponent[];
  template: PayslipTemplate | null;
  reportId: string | null;
  templateId: string | null;
  pagination: PaginationInfo | null;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  reportExists: boolean;
  templateLoading: "idle" | "pending" | "succeeded" | "failed";
  templateError: string | null;
  isDownloading: "csv" | "excel" | null;
  isDeleting: boolean;
}

// ----------------- INITIAL STATE -----------------

const initialState: PayslipReportState = {
  components: [],
  template: null,
  reportId: null,
  templateId: null,
  pagination: null,
  loading: "idle",
  error: null,
  reportExists: true,
  templateLoading: "idle",
  templateError: null,
  isDownloading: null,
  isDeleting: false,
};

// ----------------- ASYNC THUNKS -----------------

export const fetchPayslipComponentReports = createAsyncThunk(
  "payslipReport/fetchAll",
  async ({ page = 1, limit = 10, filter = "" }: { page?: number; limit?: number; filter?: string }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/report/getAll/component/payslipComponent`, {
        params: { page, limit, search: filter },
      });
      return data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 404 && error.response.data?.error === `Report for type "payslipComponent" not found. Please create this report first.`) {
        return rejectWithValue({
          message: error.response.data.error,
          isNotFound: true,
        });
      }
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch reports",
        isNotFound: false,
      });
    }
  }
);

export const fetchPayslipTemplateById = createAsyncThunk(
  "payslipReport/fetchTemplate",
  async (templateId: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/report/getTemplate/${templateId}`);
      return data as PayslipTemplate;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch template");
    }
  }
);

export const updatePayslipTemplate = createAsyncThunk(
  "payslipReport/updateTemplate",
  async ({ templateId, templateData }: { templateId: string; templateData: PayslipTemplate }, { rejectWithValue }) => {
    try {
      await axiosInstance.patch(`/report/updateTemplate/component/${templateId}`, templateData);
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update template");
    }
  }
);

export const deletePayslipReport = createAsyncThunk(
  "payslipReport/delete",
  async (reportId: string, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/report/delete/${reportId}`);
      dispatch(fetchPayslipComponentReports({}));
      return reportId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete report");
    }
  }
);

export const downloadPayslipReport = createAsyncThunk(
  "payslipReport/download",
  async ({ format }: { format: "csv" | "excel" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/report/export/payslipComponent`, {
        params: { format },
        responseType: "blob",
      });
      return { data: response.data, format };
    } catch (error: any) {
      if (error.response?.data instanceof Blob && error.response.data.type.includes('json')) {
        const errorText = await error.response.data.text();
        const errorJson = JSON.parse(errorText);
        return rejectWithValue(errorJson.message || 'Failed to download file.');
      }
      return rejectWithValue(error.response?.data?.message || "Download failed");
    }
  }
);

// ----------------- SLICE DEFINITION -----------------

const payslipReportSlice = createSlice({
  name: "payslipReport",
  initialState,
  reducers: {
    clearPayslipReportError: (state) => {
      state.error = null;
      state.templateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Reports
      .addCase(fetchPayslipComponentReports.pending, (state) => {
        state.loading = "pending";
        state.error = null;
        state.reportExists = true;
      })
      .addCase(fetchPayslipComponentReports.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.components = action.payload.components;
        state.reportId = action.payload.reportId || null;
        state.templateId = action.payload.templateId;
        state.pagination = {
          totalItems: action.payload.total,
          currentPage: action.payload.page,
          limit: action.payload.limit,
          totalPages: Math.ceil(action.payload.total / action.payload.limit),
        };
        state.reportExists = true;
      })
      .addCase(fetchPayslipComponentReports.rejected, (state, action) => {
        state.loading = "failed";
        const payload = action.payload as { message: string, isNotFound: boolean };
        state.error = payload.message;
        state.components = [];
        state.pagination = null;
        if (payload.isNotFound) {
          state.reportExists = false;
          state.reportId = null; // Ensure reportId is null if the report doesn't exist
          state.templateId = null; // Ensure templateId is null as well
        } else {
          state.reportExists = true;
        }
      })
      // Fetch Template
      .addCase(fetchPayslipTemplateById.pending, (state) => {
        state.templateLoading = "pending";
        state.templateError = null;
      })
      .addCase(fetchPayslipTemplateById.fulfilled, (state, action: PayloadAction<PayslipTemplate>) => {
        state.templateLoading = "succeeded";
        state.template = action.payload;
      })
      .addCase(fetchPayslipTemplateById.rejected, (state, action) => {
        state.templateLoading = "failed";
        state.templateError = action.payload as string;
      })
      // Update Template
      .addCase(updatePayslipTemplate.pending, (state) => {
        state.templateLoading = "pending";
        state.templateError = null;
      })
      .addCase(updatePayslipTemplate.fulfilled, (state) => {
        state.templateLoading = "succeeded";
      })
      .addCase(updatePayslipTemplate.rejected, (state, action) => {
        state.templateLoading = "failed";
        state.templateError = action.payload as string;
      })
      // Delete Report
      .addCase(deletePayslipReport.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deletePayslipReport.fulfilled, (state) => {
        state.isDeleting = false;
        // Optionally, reset state after deletion
        state.components = [];
        state.reportExists = false;
        state.reportId = null;
        state.templateId = null;
        state.pagination = null;
      })
      .addCase(deletePayslipReport.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      })
      // Download Report
      .addCase(downloadPayslipReport.pending, (state, action) => {
        state.isDownloading = action.meta.arg.format;
      })
      .addCase(downloadPayslipReport.fulfilled, (state, action) => {
        const { data: blobData, format } = action.payload;
        const url = window.URL.createObjectURL(new Blob([blobData]));
        const link = document.createElement("a");
        link.href = url;
        const extension = format === "excel" ? "xlsx" : "csv";
        link.setAttribute("download", `payslip-component-report.${extension}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        state.isDownloading = null;
      })
      .addCase(downloadPayslipReport.rejected, (state, action) => {
        state.isDownloading = null;
        state.error = action.payload as string;
      });
  },
});

export const { clearPayslipReportError } = payslipReportSlice.actions;
export default payslipReportSlice.reducer;