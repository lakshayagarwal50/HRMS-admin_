import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Employee {
  id: string;
  employeeCode: string;
  employeeName: string;
  joiningDate: string;
  department: string;
  location: string;
  designation: string;
  payslipComponent: string;
}

interface EmployeeState {
  employees: Employee[];
}

const initialState: EmployeeState = {
  employees: [
    {
      id: "1",
      employeeCode: "1651",
      employeeName: "Cody Fisher",
      joiningDate: "2022-02-15",
      department: "Designing",
      location: "Noida",
      designation: "Design",
      payslipComponent: "Default",
    },
    {
      id: "2",
      employeeCode: "8541",
      employeeName: "Ralph Edwards",
      joiningDate: "2022-01-10",
      department: "Development",
      location: "Noida",
      designation: "BA",
      payslipComponent: "Default",
    },
    // Add more employees here or load dynamically
  ],
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setEmployees(state, action: PayloadAction<Employee[]>) {
      state.employees = action.payload;
    },
  },
});

export const { setEmployees } = employeeSlice.actions;
export default employeeSlice.reducer;