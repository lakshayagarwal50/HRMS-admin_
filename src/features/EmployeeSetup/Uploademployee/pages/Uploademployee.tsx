import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { UploadCloud, Download, Trash2, X } from "lucide-react";
import { axiosInstance } from "../../../../services/index";

// --- TYPE DEFINITIONS ---
// For a larger project, these could be in a separate types file.
interface EmployeeData {
  // A unique ID for React's key prop and stable updates/deletes.
  id: number;
  // All fields from the Excel sheet
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  joiningDate: string;
  department: string;
  designation: string;
  role: string;
  ctc: string;
  phone: string;
  leaveType: string;
  reportingManager: string;
  location: string;
  payslipComponent: string;
  workingPattern: string;
  holidayGroup: string;
}

// Use a partial record to store errors only for the fields that have them.
type ValidationError = Partial<Record<keyof EmployeeData, string>>;

// --- CONSTANTS & HELPERS ---

// Defines the order and display name of table columns.
const TABLE_HEADERS: { key: keyof EmployeeData; label: string }[] = [
  { key: "title", label: "Title" },
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone Number" },
  { key: "gender", label: "Gender" },
  { key: "joiningDate", label: "Joining Date" },
  { key: "ctc", label: "CTC" },
  { key: "department", label: "Department" },
  { key: "designation", label: "Designation" },
  { key: "role", label: "Role" },
  { key: "reportingManager", label: "Reporting Manager" },
  { key: "leaveType", label: "Leave Type" },
  { key: "workingPattern", label: "Working Pattern" },
  { key: "holidayGroup", label: "Holiday Group" },
  { key: "location", label: "Location" },
  { key: "payslipComponent", label: "Payslip Component" },
];

// Mapping from Excel headers to our EmployeeData keys. Case-insensitive.
const HEADER_TO_KEY_MAP: { [key: string]: keyof EmployeeData } = {
  title: "title",
  firstname: "firstName",
  lastname: "lastName",
  email: "email",
  "phone number": "phone",
  gender: "gender",
  "joining date": "joiningDate",
  ctc: "ctc",
  department: "department",
  designation: "designation",
  role: "role",
  "reporting manager": "reportingManager",
  "leave type": "leaveType",
  "working pattern": "workingPattern",
  "holiday group": "holidayGroup",
  location: "location",
  "payslip component": "payslipComponent",
};

/**
 * Parses a date string from various formats (dd/mm/yyyy, dd Mon yyyy, Excel serial)
 * @param dateStr The date string or number to parse.
 * @returns A Date object or null if invalid.
 */
const parseDate = (dateStr: string | number): Date | null => {
  if (typeof dateStr === 'number') {
    // Handle Excel's date serial number format.
    const date = new Date((dateStr - 25569) * 86400 * 1000);
    return !isNaN(date.getTime()) ? date : null;
  }
  
  if (typeof dateStr !== 'string') return null;

  // Try dd/mm/yyyy
  const partsSlash = dateStr.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (partsSlash) {
    const day = parseInt(partsSlash[1], 10);
    const month = parseInt(partsSlash[2], 10);
    const year = parseInt(partsSlash[3], 10);
    if (day > 0 && day <= 31 && month > 0 && month <= 12) {
      return new Date(year, month - 1, day);
    }
  }

  // Try dd Mon yyyy (e.g., 25 Aug 2025)
  const partsSpace = Date.parse(dateStr);
  if (!isNaN(partsSpace)) {
    return new Date(partsSpace);
  }
  
  return null;
};

/**
 * Formats a date string to YYYY-MM-DD for backend submission.
 * @param dateStr The date string in preview format.
 * @returns Formatted date or empty string if invalid.
 */
const formatDateForBackend = (dateStr: string): string => {
  const parsed = parseDate(dateStr);
  if (parsed) {
    return parsed.toISOString().slice(0, 10);
  }
  return '';
};

// --- MAIN COMPONENT ---
export default function UploadEmployee() {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<EmployeeData[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Re-validate data whenever the preview data changes (e.g., on edit or delete)
  useEffect(() => {
    if (previewData.length > 0) {
      validateData(previewData);
    }
  }, [previewData]);

  // Main validation logic
  const validateData = (data: EmployeeData[]) => {
    const newErrors: ValidationError[] = data.map((employee) => {
      const employeeErrors: ValidationError = {};
      
      // Email validation
      if (!employee.email) {
        employeeErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(employee.email)) {
        employeeErrors.email = "Invalid email address";
      }
      
      // Phone validation (10 digits)
      if (!employee.phone) {
        employeeErrors.phone = "Phone number is required";
      } else if (!/^\d{10}$/.test(employee.phone.replace(/\s/g, ""))) {
        employeeErrors.phone = "Must be 10 digits";
      }
      
      // CTC validation (positive number)
      if (!employee.ctc) {
        employeeErrors.ctc = "CTC is required";
      } else if (isNaN(Number(employee.ctc)) || Number(employee.ctc) <= 0) {
        employeeErrors.ctc = "Must be a positive number";
      }

      // Joining Date validation
      if (!employee.joiningDate) {
        employeeErrors.joiningDate = "Joining date is required";
      } else {
        const parsed = parseDate(employee.joiningDate);
        if (!parsed) {
          employeeErrors.joiningDate = "Invalid format (use DD/MM/YYYY)";
        } else {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Compare dates only
          if (parsed > today) {
            employeeErrors.joiningDate = "Date cannot be in the future";
          }
        }
      }

      // Gender validation
      if (!employee.gender) {
        employeeErrors.gender = "Gender is required";
      } else if (!["male", "female"].includes(employee.gender.toLowerCase())) {
        employeeErrors.gender = "Must be Male or Female";
      }

      // Required fields check
      const requiredFields: (keyof EmployeeData)[] = [
        "title", "firstName", "lastName", "department", "designation", 
        "role", "reportingManager", "location"
      ];

      requiredFields.forEach(field => {
        if (!employee[field]) {
          employeeErrors[field] = "This field is required";
        }
      });
      
      return employeeErrors;
    });
    setErrors(newErrors);
    return newErrors.every((err) => Object.keys(err).length === 0);
  };
  
  // Parse Excel file and set state
  const processFile = async (selectedFile: File) => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setFile(selectedFile);
    setShowPreview(false);

    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data, { type: "buffer", cellDates: true });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      const formattedData: EmployeeData[] = jsonData.map((row, index) => {
        const newRow: Partial<EmployeeData> = { id: index };
        for (const header in row) {
          const key = HEADER_TO_KEY_MAP[header.toLowerCase().trim()];
          if (key) {
             // For dates, SheetJS might parse them. We format them back to a consistent string.
             if (key === 'joiningDate' && row[header] instanceof Date) {
                const d = row[header];
                (newRow as any)[key] = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
            } else {
                (newRow as any)[key] = String(row[header]);
            }
          }
        }
        // Ensure all keys are present to maintain object shape
        return {
          id: index,
          title: newRow.title || "",
          firstName: newRow.firstName || "",
          lastName: newRow.lastName || "",
          email: newRow.email || "",
          phone: newRow.phone || "",
          gender: newRow.gender || "",
          joiningDate: newRow.joiningDate || "",
          ctc: newRow.ctc || "",
          department: newRow.department || "",
          designation: newRow.designation || "",
          role: newRow.role || "",
          reportingManager: newRow.reportingManager || "",
          leaveType: newRow.leaveType || "",
          workingPattern: newRow.workingPattern || "",
          holidayGroup: newRow.holidayGroup || "",
          location: newRow.location || "",
          payslipComponent: newRow.payslipComponent || "",
        };
      });

      setPreviewData(formattedData);
      setShowPreview(true);
    } catch (error) {
      console.error("Error parsing the file:", error);
      alert("An error occurred while parsing the file. Please ensure it's a valid XLSX file.");
    } finally {
      setIsProcessing(false);
    }
  };

  // react-dropzone hook
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true, // We trigger the file dialog via our own button
    noKeyboard: true,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
  });

  // Reset state when file is removed
  const removeFile = () => {
    setFile(null);
    setPreviewData([]);
    setErrors([]);
    setShowPreview(false);
  };
  
  // Handle changes in the data table inputs
  const handleRowChange = (index: number, field: keyof EmployeeData, value: string) => {
    const updatedData = [...previewData];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setPreviewData(updatedData); // This triggers the useEffect for validation
  };

  // Delete a row from the preview
  const deleteRow = (idToDelete: number) => {
    setPreviewData((prevData) => prevData.filter((row) => row.id !== idToDelete));
  };
  
  // Generate and download a sample template
  const handleDownloadTemplate = () => {
    const sampleData = [
      {
        "Title": "MR",
        "FirstName": "Amit",
        "LastName": "Kumar",
        "Email": "amit.kumar@example.com",
        "Phone Number": "9876543210",
        "Gender": "Male",
        "Joining Date": "15/07/2024",
        "CTC": "800000",
        "Department": "Development",
        "Designation": "Team Member",
        "Role": "employee",
        "Reporting Manager": "Kushal Singh (1001)",
        "Leave Type": "",
        "Working Pattern": "",
        "Holiday Group": "",
        "Location": "noida",
        "Payslip Component": "",
      },
      {
        "Title": "MS",
        "FirstName": "Priya",
        "LastName": "Sharma",
        "Email": "priya.sharma@example.com",
        "Phone Number": "9123456780",
        "Gender": "Female",
        "Joining Date": "01/08/2024",
        "CTC": "1200000",
        "Department": "HR",
        "Designation": "Manager",
        "Role": "manager",
        "Reporting Manager": "Anita Verma (1002)",
        "Leave Type": "",
        "Working Pattern": "",
        "Holiday Group": "",
        "Location": "delhi",
        "Payslip Component": "",
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "Employee_Upload_Template.xlsx");
  };

  // Handle final submission
  const handleSubmit = async () => {
    const isDataValid = validateData(previewData);
    if (!isDataValid) {
      alert("Please fix the errors before submitting.");
      return;
    }
    const submitData = previewData.map(row => ({
      title: row.title,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      gender: row.gender,
      joiningDate: formatDateForBackend(row.joiningDate),
      department: row.department,
      designation: row.designation,
      role: row.role,
      ctc: row.ctc,
      phone: row.phone,
      leaveType: row.leaveType,
      reportingManager: row.reportingManager,
      location: row.location,
      payslipComponent: row.payslipComponent,
      workingPattern: row.workingPattern,
      holidayGroup: row.holidayGroup,
    }));
    setIsProcessing(true);
    try {
      const response = await axiosInstance.post('/employees/upload/create', submitData);
      alert('Employees uploaded successfully!');
      removeFile();
    } catch (error) {
      console.error('Error uploading employees:', error);
      alert('Error uploading employees. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // --- RENDER FUNCTIONS ---
  
  const renderInitialState = () => (
    <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 ${isDragActive ? 'border-violet-500 bg-violet-50' : 'border-gray-300'}`}>
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-20 w-20 text-gray-400 mb-4" strokeWidth={1} />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {isDragActive ? "Drop the file here..." : "Upload Employees File"}
        </h3>
        <p className="text-gray-500 mb-6">
            Drag & drop your .xlsx file here, or click below to select a file.
        </p>
        <div className="flex justify-center items-center gap-4">
            <button
                onClick={open}
                className="bg-violet-700 text-white font-semibold py-2 px-8 rounded-lg shadow-md hover:bg-violet-800 transition-all duration-300"
            >
                UPLOAD
            </button>
            <button 
                onClick={handleDownloadTemplate}
                className="bg-white text-violet-700 font-semibold py-2 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center"
            >
                <Download size={16} className="mr-2" />
                DOWNLOAD TEMPLATE
            </button>
        </div>
    </div>
  );

  const renderFilePreview = () => (
    <>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex justify-between items-center">
        <div>
          <p className="font-semibold text-gray-800">{file?.name}</p>
          <p className="text-sm text-gray-500">
            {(file!.size / 1024).toFixed(1)} KB
          </p>
        </div>
        <button
          onClick={removeFile}
          className="bg-red-100 text-red-600 rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-200 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex items-center gap-4 mt-5">
        <p className="text-gray-600 font-medium">
          File ready to be processed.
        </p>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="text-violet-700 font-semibold ml-auto"
          disabled={previewData.length === 0}
        >
          {showPreview ? "HIDE PREVIEW" : "SHOW PREVIEW"}
        </button>
      </div>
    </>
  );

  const renderDataTable = () => (
    <div className="mt-8">
      <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delete
              </th>
              {TABLE_HEADERS.map(({ key, label }) => (
                <th key={key} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {previewData.map((row, index) => (
              <tr key={row.id}>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button onClick={() => deleteRow(row.id)} className="p-1 text-gray-400 hover:text-red-500">
                    <Trash2 size={18} />
                  </button>
                </td>
                {TABLE_HEADERS.map(({ key }) => (
                  <td key={key} className="px-2 py-1 whitespace-nowrap">
                    <div className="flex flex-col">
                      <input
                        type="text"
                        value={row[key] || ""}
                        onChange={(e) => handleRowChange(index, key, e.target.value)}
                        className={`w-48 p-2 text-sm border rounded-md transition-colors ${
                          errors[index]?.[key]
                            ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                        }`}
                      />
                      {errors[index]?.[key] && (
                        <span className="text-red-600 text-xs mt-1 w-48">
                          {errors[index][key]}
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-start">
        <button
          onClick={handleSubmit}
          disabled={isProcessing}
          className="bg-violet-700 text-white font-bold py-3 px-12 rounded-lg shadow-md hover:bg-violet-800 transition-all duration-300 disabled:bg-violet-400 disabled:cursor-not-allowed"
        >
          SUBMIT
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Upload Employee</h1>
          <nav className="text-sm text-gray-500">
            <span>Dashboard</span>
            <span className="mx-2">/</span>
            <span>Employee Setup</span>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">Upload Employees</span>
          </nav>
        </header>
        
        <main className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
          {!file ? renderInitialState() : renderFilePreview()}
        </main>

        {showPreview && previewData.length > 0 && renderDataTable()}
      </div>
    </div>
  );
}