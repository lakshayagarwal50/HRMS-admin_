import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";

// --- TYPE DEFINITIONS ---
// For a larger project, these would be in a separate types.ts file.
interface EmployeeData {
  // A unique ID for React's key prop and stable updates/deletes.
  id: number;
  delete: null; // Placeholder for the delete button column
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  joiningDate: string;
  ctc: string;
  departmentId: string;
  designationId: string;
  roleId: string;
  reportingManagerId: string;
  leaveTypeId: string;
  workingPatternId: string;
  holidayGroupId: string;
}

// Use a partial record to store errors only for the fields that have them.
type ValidationError = Partial<Record<keyof EmployeeData, string>>;

// --- MOCK DATA & HELPERS ---
// Column headers for the data table.
const TABLE_HEADERS = [
  "Delete",
  "Email",
  "FirstName",
  "lastName",
  "Phone Number",
  "Gender",
  "Joining Date",
  "CTC",
  "Department ID",
  "Designation ID",
  "Role ID",
  "Reporting Manager ID",
  "Leave Type ID",
];

// Mapping from Excel headers to our EmployeeData keys. Case-insensitive.
const HEADER_TO_KEY_MAP: { [key: string]: keyof EmployeeData } = {
  email: "email",
  firstname: "firstName",
  lastname: "lastName",
  "phone number": "phone",
  gender: "gender",
  "joining date": "joiningDate",
  ctc: "ctc",
  "department id": "departmentId",
  "designation id": "designationId",
  "role id": "roleId",
  "reporting manager id": "reportingManagerId",
  "leave type id": "leaveTypeId",
  "working pattern id": "workingPatternId",
  "holiday group id": "holidayGroupId",
};

// --- ICONS (as inline SVG components) ---
const UploadIllustration = () => (
  <svg
    width="200"
    height="160"
    viewBox="0 0 200 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto mb-6"
  >
    <g clipPath="url(#clip0_101_2)">
      <path
        d="M100 135C138.66 135 170 116.046 170 92.5C170 68.9543 138.66 50 100 50C61.3401 50 30 68.9543 30 92.5C30 116.046 61.3401 135 100 135Z"
        fill="#F3E8FF"
      />
      <path
        d="M125 100H75C73.3431 100 72 101.343 72 103V130H128V103C128 101.343 126.657 100 125 100Z"
        fill="#A78BFA"
      />
      <rect x="85" y="80" width="30" height="20" rx="4" fill="#6D28D9" />
      <path
        d="M118 75H82C80.3431 75 79 76.3431 79 78V95H121V78C121 76.3431 119.657 75 118 75Z"
        fill="#EDE9FE"
      />
      <path
        d="M100 130L100 105"
        stroke="#6D28D9"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M108 122L108 105"
        stroke="#6D28D9"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M92 122L92 105"
        stroke="#6D28D9"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="88" y="65" width="24" height="10" rx="2" fill="#C4B5FD" />
      <path
        d="M135 45H65C62.2386 45 60 47.2386 60 50V60H140V50C140 47.2386 137.761 45 135 45Z"
        fill="#A78BFA"
      />
      <path
        d="M130 35H70C67.2386 35 65 37.2386 65 40V45H135V40C135 37.2386 132.761 35 130 35Z"
        fill="#6D28D9"
      />
      <rect x="75" y="25" width="50" height="10" rx="2" fill="#C4B5FD" />
      <path d="M100 105L115 130" stroke="#A78BFA" strokeWidth="2" />
      <path d="M100 105L85 130" stroke="#A78BFA" strokeWidth="2" />
    </g>
    <defs>
      <clipPath id="clip0_101_2">
        <rect width="200" height="160" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-2"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-red-500 hover:text-red-700"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<EmployeeData[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Effect to re-validate data whenever the preview data changes
  useEffect(() => {
    if (previewData.length > 0) {
      validateData(previewData);
    }
  }, [previewData]);

  // Function to trigger the hidden file input
  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection from the input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewData([]);
      setErrors([]);
      setShowPreview(false);
    }
  };

  // Remove the selected file and reset state
  const removeFile = () => {
    setFile(null);
    setPreviewData([]);
    setErrors([]);
    setShowPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Parse the Excel file and prepare data for preview
  const handleUploadAndPreview = async () => {
    if (!file) return;
    setIsProcessing(true);
    setShowPreview(false);

    try {
      // Dynamically load the xlsx library if it's not available
      if (typeof XLSX === "undefined") {
        console.error("SheetJS library (XLSX) not found.");
        // You could show an error to the user here.
        setIsProcessing(false);
        return;
      }

      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
      });

      const formattedData: EmployeeData[] = jsonData.map((row, index) => {
        const newRow: Partial<EmployeeData> = { id: index, delete: null };
        for (const header in row) {
          const key = HEADER_TO_KEY_MAP[header.toLowerCase().trim()];
          if (key) {
            (newRow as any)[key] = String(row[header]);
          }
        }
        // Ensure all keys are present
        return {
          id: index,
          delete: null,
          email: newRow.email || "",
          firstName: newRow.firstName || "",
          lastName: newRow.lastName || "",
          phone: newRow.phone || "",
          gender: newRow.gender || "",
          joiningDate: newRow.joiningDate || "",
          ctc: newRow.ctc || "",
          departmentId: newRow.departmentId || "",
          designationId: newRow.designationId || "",
          roleId: newRow.roleId || "",
          reportingManagerId: newRow.reportingManagerId || "",
          leaveTypeId: newRow.leaveTypeId || "",
          workingPatternId: newRow.workingPatternId || "",
          holidayGroupId: newRow.holidayGroupId || "",
        };
      });

      setPreviewData(formattedData);
      setShowPreview(true);
    } catch (error) {
      console.error("Error parsing the file:", error);
      // Here you could set a user-facing error message
    } finally {
      setIsProcessing(false);
    }
  };

  // Validation logic
  const validateData = (data: EmployeeData[]) => {
    const newErrors: ValidationError[] = data.map((employee) => {
      const employeeErrors: ValidationError = {};
      if (!employee.email) {
        employeeErrors.email = "Please Enter Required Fields";
      } else if (!/\S+@\S+\.\S+/.test(employee.email)) {
        employeeErrors.email = "Invalid Email Address";
      }

      if (!employee.phone) {
        employeeErrors.phone = "Please Enter Required Fields";
      } else if (!/^\d{10}$/.test(employee.phone.replace(/\s/g, ""))) {
        employeeErrors.phone = "Invalid Phone Number";
      }

      if (!employee.firstName)
        employeeErrors.firstName = "Please Enter Required Fields";
      if (!employee.lastName)
        employeeErrors.lastName = "Please Enter Required Fields";
      if (!employee.departmentId)
        employeeErrors.departmentId = "Invalid Department Code";

      // Add more validation rules as needed
      return employeeErrors;
    });
    setErrors(newErrors);
    return newErrors.every((err) => Object.keys(err).length === 0);
  };

  // Handle changes in the data table inputs
  const handleRowChange = (
    index: number,
    field: keyof EmployeeData,
    value: string
  ) => {
    const updatedData = [...previewData];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setPreviewData(updatedData); // This will trigger the useEffect for validation
  };

  // Delete a row from the preview
  const deleteRow = (idToDelete: number) => {
    setPreviewData((prevData) =>
      prevData.filter((row) => row.id !== idToDelete)
    );
  };

  // Handle the final submission
  const handleSubmit = () => {
    const isDataValid = validateData(previewData);
    if (!isDataValid) {
      // A more user-friendly modal/toast would be better than alert()
      alert("Please fix the errors before submitting.");
      return;
    }
    console.log("Submitting data:", previewData);
    alert(
      `${previewData.length} valid employee records are ready to be submitted.`
    );
    // Here you would typically make an API call to your backend.
    // e.g., fetch('/api/employees/bulk-upload', { method: 'POST', body: JSON.stringify(previewData) });
  };

  // --- RENDER FUNCTIONS ---

  const renderInitialState = () => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <UploadIllustration />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Upload Employees File
      </h3>
      <p className="text-gray-500 mb-6">
        Please follow below steps to add employees to PyThru Payroll
      </p>
      <div className="text-left inline-block text-gray-500 mb-8">
        <p>
          <span className="font-semibold">Step 1:</span> Click on "DOWNLOAD
          TEMPLATE" and save the sample file on your computer
        </p>
        <p>
          <span className="font-semibold">Step 2:</span> Follow the instruction
          to update sample file with your actual data and save the file
        </p>
        <p>
          <span className="font-semibold">Step 3:</span> Click on the "UPLOAD"
          button to look for upload file and a windows popup will open
        </p>
        <p>
          <span className="font-semibold">Step 4:</span> Select your saved file
          and click on "UPLOAD" button
        </p>
      </div>
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={handleFileSelectClick}
          className="bg-violet-700 text-white font-semibold py-2 px-8 rounded-lg shadow-md hover:bg-violet-800 transition-all duration-300"
        >
          UPLOAD
        </button>
        <button className="bg-white text-violet-700 font-semibold py-2 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center">
          <DownloadIcon />
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
          className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          <CloseIcon />
        </button>
      </div>
      <div className="flex items-center gap-4 mt-5">
        <button
          onClick={handleUploadAndPreview}
          disabled={isProcessing}
          className="bg-violet-700 text-white font-semibold py-2 px-8 rounded-lg shadow-md hover:bg-violet-800 transition-all duration-300 disabled:bg-violet-400 disabled:cursor-not-allowed"
        >
          {isProcessing ? "PROCESSING..." : "UPLOAD"}
        </button>
        <button className="bg-white text-violet-700 font-semibold py-2 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center">
          <DownloadIcon />
          DOWNLOAD TEMPLATE
        </button>
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
              {TABLE_HEADERS.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.replace(/ /g, "\u00A0")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {previewData.map((row, index) => (
              <tr key={row.id}>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button onClick={() => deleteRow(row.id)} className="p-1">
                    <TrashIcon />
                  </button>
                </td>
                {(Object.keys(row) as Array<keyof EmployeeData>)
                  .filter(
                    (k) =>
                      k !== "id" &&
                      k !== "delete" &&
                      TABLE_HEADERS.map((h) =>
                        h.toLowerCase().replace(/ /g, "")
                      ).includes(k.toLowerCase())
                  )
                  .map((key) => (
                    <td key={key} className="px-2 py-1 whitespace-nowrap">
                      <div className="flex flex-col">
                        <input
                          type="text"
                          value={row[key] || ""}
                          onChange={(e) =>
                            handleRowChange(index, key, e.target.value)
                          }
                          className={`w-40 p-2 text-sm border rounded-md transition-colors ${
                            errors[index]?.[key]
                              ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                          }`}
                        />
                        {errors[index]?.[key] && (
                          <span className="text-red-600 text-xs mt-1">
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
          className="bg-violet-700 text-white font-bold py-3 px-12 rounded-lg shadow-md hover:bg-violet-800 transition-all duration-300"
        >
          SUBMIT
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Add SheetJS library from CDN */}

      <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Upload Employee
            </h1>
            <nav className="text-sm text-gray-500">
              <span>
                <a href="/dashboard">Dashboard</a>
              </span>
              <span className="mx-2">/</span>
              <span>Employee Setup</span>
              <span className="mx-2">/</span>
              <span className="text-gray-800 font-medium">
                Upload Employees
              </span>
            </nav>
          </header>

          {/* Main Content Box */}
          <main className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
            {!file ? renderInitialState() : renderFilePreview()}
          </main>

          {showPreview && previewData.length > 0 && renderDataTable()}
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept=".xlsx, .xls"
        />
      </div>
    </>
  );
}