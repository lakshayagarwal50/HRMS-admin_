import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { z } from "zod"; // 1. Import Zod
import { UploadCloud, Download, Trash2, X } from "lucide-react";
import { axiosInstance } from "../../../../services/index";
import toast from "react-hot-toast";

// Interface and constants remain the same...
interface EmployeeData {
  id: number;
  title: string;
  firstName: string;
  lastName:string;
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

type ValidationError = Partial<Record<keyof EmployeeData, string>>;

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
  
const parseDate = (dateStr: string | number): Date | null => {
    if (typeof dateStr === 'number') {
        const date = new Date((dateStr - 25569) * 86400 * 1000);
        return !isNaN(date.getTime()) ? date : null;
    }
    if (typeof dateStr !== 'string') return null;
    const partsSlash = dateStr.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (partsSlash) {
        const day = parseInt(partsSlash[1], 10);
        const month = parseInt(partsSlash[2], 10);
        const year = parseInt(partsSlash[3], 10);
        if (day > 0 && day <= 31 && month > 0 && month <= 12) {
            return new Date(year, month - 1, day);
        }
    }
    const partsSpace = Date.parse(dateStr);
    if (!isNaN(partsSpace)) {
        return new Date(partsSpace);
    }
    return null;
};

const formatDateForBackend = (dateStr: string): string => {
    const parsed = parseDate(dateStr);
    if (parsed) {
        return parsed.toISOString().slice(0, 10);
    }
    return '';
};

// 2. Define the Zod schema for a single employee
const nameRegex = /^[a-zA-Z\s'-.]+$/;
const validTitles = ['mr', 'ms', 'mrs', 'miss', 'dr'];

const employeeSchema = z.object({
  // Title: Must be a valid title and not just numbers.
  title: z
    .string()
    .min(1, "This field is required")
    .refine((val) => validTitles.includes(val.toLowerCase().replace('.', '')), {
      message: "Invalid title (e.g., Mr, Ms)",
    }),

  // Name fields: required and must not contain numbers
  firstName: z
    .string()
    .min(1, "This field is required")
    .regex(nameRegex, "Invalid characters in name"),
  lastName: z
    .string()
    .min(1, "This field is required")
    .regex(nameRegex, "Invalid characters in name"),

  // Email validation
  email: z.string().min(1, "Email is required").email("Invalid email address"),

  // Phone validation
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d{10}$/, "Must be 10 digits"),

  // Gender validation (case-insensitive, now includes "others")
  gender: z
    .string()
    .min(1, "Gender is required")
    .refine(
      (val) => ["male", "female", "others"].includes(val.toLowerCase()),
      {
        message: "Must be Male, Female, or Others",
      }
    ),

  // Date validation using a custom refine for DD/MM/YYYY format
   joiningDate: z.string().superRefine((dateStr, ctx) => {
    // 1. First, check if the field is empty.
    if (!dateStr || dateStr.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Joining date is required",
      });
      return; // Stop further validation
    }

    // 2. If not empty, try to parse it.
    const parsed = parseDate(dateStr);
    if (!parsed) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid format (use DD/MM/YYYY)",
      });
      return; // Stop further validation
    }

    // 3. If parsing is successful, check if the date is in the future.
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date
    if (parsed > today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Date cannot be in the future",
      });
    }
  }),

  // CTC validation
  ctc: z
    .string()
    .min(1, "CTC is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Must be a positive number",
    }),

  // ALL fields are now required
  department: z.string().min(1, "This field is required"),
  designation: z.string().min(1, "This field is required"),
  role: z.string().min(1, "This field is required"),
  reportingManager: z.string().min(1, "This field is required"),
  location: z.string().min(1, "This field is required"),
  leaveType: z.string().min(1, "This field is required"),
  workingPattern: z.string().min(1, "This field is required"),
  holidayGroup: z.string().min(1, "This field is required"),
  payslipComponent: z.string().min(1, "This field is required"),

  // id for internal state management
  id: z.number(),
});

export default function UploadEmployee() {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<EmployeeData[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (previewData.length > 0) {
      validateData(previewData);
    }
  }, [previewData]);
  
  // 3. Refactor validateData to use the Zod schema
  const validateData = (data: EmployeeData[]) => {
    const newErrors: ValidationError[] = data.map((employee) => {
      const result = employeeSchema.safeParse(employee);
      if (result.success) {
        return {};
      }
      // Format Zod errors into the structure your component expects
      const formattedErrors: ValidationError = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof EmployeeData;
        formattedErrors[path] = issue.message;
      }
      return formattedErrors;
    });

    setErrors(newErrors);
    return newErrors.every((err) => Object.keys(err).length === 0);
  };
  
  // No changes needed for the rest of the component logic...
  // processFile, onDrop, removeFile, handleRowChange, deleteRow,
  // handleDownloadTemplate, handleSubmit, and all render functions
  // remain exactly the same.
  const processFile = async (selectedFile: File) => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setFile(selectedFile);
    setShowPreview(false);
    setServerErrors([]);
    const id = toast.loading("Processing file...", {
      className: "bg-gray-50 text-gray-800",
    });
    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data, { type: "buffer", cellDates: true });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
      });
      const formattedData: EmployeeData[] = jsonData.map((row, index) => {
        const newRow: Partial<EmployeeData> = { id: index };
        for (const header in row) {
          const key = HEADER_TO_KEY_MAP[header.toLowerCase().trim()];
          if (key) {
            if (key === "joiningDate" && row[header] instanceof Date) {
              const d = row[header];
              (newRow as any)[
                key
              ] = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
            } else {
              (newRow as any)[key] = String(row[header]);
            }
          }
        }
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
      toast.success("File processed successfully!", {
        id,
        className: "bg-green-50 text-green-800",
      });
    } catch (error) {
      console.error("Error parsing the file:", error);
      toast.error(
        "An error occurred while parsing the file. Please ensure it's a valid XLSX file.",
        { id, className: "bg-red-50 text-red-800" }
      );
    } finally {
      setIsProcessing(false);
    }
  };
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    disabled: isProcessing,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
  });
  const removeFile = () => {
    setFile(null);
    setPreviewData([]);
    setErrors([]);
    setServerErrors([]);
    setShowPreview(false);
  };
  const handleRowChange = (
    index: number,
    field: keyof EmployeeData,
    value: string
  ) => {
    const updatedData = [...previewData];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setPreviewData(updatedData);
    const updatedServerErrors = [...serverErrors];
    updatedServerErrors[index] = "";
    setServerErrors(updatedServerErrors);
  };
  const deleteRow = (idToDelete: number) => {
    setPreviewData((prevData) =>
      prevData.filter((row) => row.id !== idToDelete)
    );
    setServerErrors((prevErrors) =>
      prevErrors.filter((_, idx) => previewData[idx].id !== idToDelete)
    );
  };
  const handleDownloadTemplate = () => {
    const sampleData = [
      {
        Title: "MR",
        FirstName: "Genghis",
        LastName: "Khan",
        Email: "genghis.khan@example.com",
        "Phone Number": "9437654321",
        Gender: "Male",
        "Joining Date": "15/07/2024",
        CTC: "800000",
        Department: "Development",
        Designation: "Team Member",
        Role: "Employee",
        "Reporting Manager": "Kushal Singh (1001)",
        "Leave Type": "Sick Leave",
        "Working Pattern": "5 days Week",
        "Holiday Group": "Diwali",
        Location: "Noida",
        "Payslip Component": "Developer",
      },
      {
        Title: "Ms",
        FirstName: "Sal",
        LastName: "Marooni",
        Email: "sal.marooni@example.com",
        "Phone Number": "9437694321",
        Gender: "Female",
        "Joining Date": "15/07/2024",
        CTC: "800000",
        Department: "Development",
        Designation: "Team Member",
        Role: "Employee",
        "Reporting Manager": "Kushal Singh (1001)",
        "Leave Type": "Sick Leave",
        "Working Pattern": "5 days Week",
        "Holiday Group": "Diwali",
        Location: "Noida",
        "Payslip Component": "Developer",
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "Employee_Upload_Template.xlsx");
  };
  const handleSubmit = async () => {
    const isDataValid = validateData(previewData);
    if (!isDataValid) {
      toast.error("Please fix the errors before submitting.", {
        className: "bg-red-50 text-red-800",
      });
      return;
    }
    const submitData = previewData.map((row) => ({
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
    setServerErrors(previewData.map(() => ""));
    const id = toast.loading("Uploading employees...", {
      className: "bg-gray-50 text-gray-800",
    });
    try {
      const response = await axiosInstance.post(
        "/employees/upload/create",
        submitData
      );
      const results = response.data;
      let allSuccess = true;
      const newServerErrors = previewData.map(() => "");
      results.forEach((res: { status: string; error?: string }, idx: number) => {
        if (res.status === "failed") {
          allSuccess = false;
          newServerErrors[idx] = res.error || "Unknown error";
        }
      });
      setServerErrors(newServerErrors);
      if (allSuccess) {
        toast.success("Employees uploaded successfully!", {
          id,
          className: "bg-green-50 text-green-800",
        });
        removeFile();
      } else {
        toast.error("Some employees failed to upload. See errors below.", {
          id,
          className: "bg-red-50 text-red-800",
        });
      }
    } catch (error: any) {
      console.error("Error uploading employees:", error);
      if (error.response && Array.isArray(error.response.data)) {
        const results = error.response.data;
        const newServerErrors = previewData.map(() => "");
        results.forEach(
          (res: { status: string; error?: string }, idx: number) => {
            if (res.status === "failed") {
              newServerErrors[idx] = res.error || "Unknown error";
            }
          }
        );
        setServerErrors(newServerErrors);
        toast.error("Upload failed. See errors below.", {
          id,
          className: "bg-red-50 text-red-800",
        });
      } else {
        toast.error("Error uploading employees. Please try again.", {
          id,
          className: "bg-red-50 text-red-800",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };
  const renderInitialState = () => (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 ${
        isDragActive
          ? "border-violet-500 bg-violet-50"
          : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      <UploadCloud
        className="mx-auto h-20 w-20 text-gray-400 mb-4"
        strokeWidth={1}
      />
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
        <p className="text-gray-600 font-medium">File ready to be processed.</p>
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
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Delete
              </th>
              {TABLE_HEADERS.map(({ key, label }) => (
                <th
                  key={key}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {label}
                </th>
              ))}
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Server Error
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {previewData.map((row, index) => (
              <tr key={row.id}>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button
                    onClick={() => deleteRow(row.id)}
                    disabled={isProcessing} // Add this line
                    className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
                {TABLE_HEADERS.map(({ key }) => (
                  <td key={key} className="px-2 py-1 whitespace-nowrap">
                    <div className="flex flex-col min-h-[3rem]">
                      <input
                        type="text"
                        value={row[key] || ""}
                        onChange={(e) =>
                          handleRowChange(index, key, e.target.value)
                        }
                        disabled={isProcessing} // Add this line
                        className={`w-48 p-2 text-sm border rounded-md transition-colors ${
                          errors[index]?.[key]
                            ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                        } disabled:opacity-70 disabled:cursor-not-allowed`} // Add disabled styling
                      />
                      {errors[index]?.[key] && (
                        <span className="text-red-600 text-xs mt-1 w-48">
                          {errors[index][key]}
                        </span>
                      )}
                    </div>
                  </td>
                ))}
                <td className="px-4 py-2 whitespace-nowrap">
                  {serverErrors[index] && (
                    <span className="text-red-600 text-sm">
                      {serverErrors[index]}
                    </span>
                  )}
                </td>
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