import React, { useState, useCallback } from "react";
import { useDropzone, type FileWithPath } from "react-dropzone";
import Papa from "papaparse";
import toast from "react-hot-toast";
import Table, { type Column } from "../../../components/common/Table";
import { UploadCloud, Trash2, Download } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import {
  addAttendance,
  addAttendanceWithLeave,
} from "../../../store/slice/attendanceSlice";
import type { AppDispatch, RootState } from "../../../store/store";

interface AttendanceRecord {
  id: number;
  [key: string]: any;
}

interface FileUploadAreaProps {
  title: string;
  file: FileWithPath | null;
  onFileDrop: (file: FileWithPath) => void;
  onShowPreview: () => void;
  onDownloadSample: () => void;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  title,
  file,
  onFileDrop,
  onShowPreview,
  onDownloadSample,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      if (acceptedFiles.length > 0) {
        onFileDrop(acceptedFiles[0]);
      }
    },
    [onFileDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
  });

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive
            ? "border-purple-600 bg-purple-50"
            : "border-purple-300 bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="w-12 h-12 text-purple-400" />
        <p className="mt-2 text-sm text-gray-500">
          {file ? (
            <span className="font-semibold text-gray-800">{file.path}</span>
          ) : (
            "Drag or Drop your file here"
          )}
        </p>
        <p className="text-xs text-gray-400">CSV files only</p>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={onShowPreview}
          disabled={!file}
          className="w-full px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Show Preview
        </button>
        <button
          onClick={onDownloadSample}
          className="w-full flex items-center justify-center px-4 py-2 text-purple-600 bg-white border border-purple-600 rounded-md hover:bg-purple-50"
        >
          <Download className="w-5 h-5 mr-2" />
          Sample File
        </button>
      </div>
    </div>
  );
};

const UploadAttendance = () => {
  const dispatch: AppDispatch = useDispatch();
  const { loading, error } = useSelector(
    (state: RootState) => state.attendance
  );

  const [attendanceFile, setAttendanceFile] = useState<FileWithPath | null>(
    null
  );
  const [inOutFile, setInOutFile] = useState<FileWithPath | null>(null);
  const [previewData, setPreviewData] = useState<AttendanceRecord[]>([]);
  const [tableColumns, setTableColumns] = useState<Column<AttendanceRecord>[]>(
    []
  );
  const [previewFileType, setPreviewFileType] = useState<
    "attendance" | "inout" | null
  >(null);

  const handleFileDrop =
    (setter: React.Dispatch<React.SetStateAction<FileWithPath | null>>) =>
    (file: FileWithPath) => {
      setter(file);
      toast.success(`File "${file.path}" selected successfully!`);
    };

  const generateColumns = (headers: string[]): Column<AttendanceRecord>[] => {
    const columns: Column<AttendanceRecord>[] = headers.map((header) => ({
      key: header as keyof AttendanceRecord,
      header: header
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
    }));
    columns.unshift({
      key: "action",
      header: "Delete",
      render: (row) => (
        <button onClick={() => handleDeleteRow(row.id)}>
          <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700" />
        </button>
      ),
    });
    return columns;
  };

  const handleShowPreview = (fileType: "attendance" | "inout") => {
    const fileToParse = fileType === "attendance" ? attendanceFile : inOutFile;
    if (!fileToParse) {
      toast.error("Please select a file first to show a preview.");
      return;
    }

    Papa.parse(fileToParse, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const dataWithIds = (results.data as any[]).map((row, index) => ({
          ...row,
          id: index,
        }));
        setPreviewData(dataWithIds);
        setPreviewFileType(fileType);
        if (results.meta.fields) {
          setTableColumns(generateColumns(results.meta.fields));
        }
        toast.success("File parsed! Preview data is now visible below.");
      },
      error: (err) => {
        console.error("Error parsing CSV:", err);
        toast.error("Failed to parse CSV. Please check the file format.");
      },
    });
  };

  const downloadSampleCSV = (type: "attendance" | "inout") => {
    const headers =
      type === "inout"
        ? "Employee Id,Date (dd/mm/yy),In Time (24 hour format),Out Time (24 hour format)"
        : "Employee Code,Date (dd/mm/yy),Hours,Type,Notes,Leaves ID";

    const sampleData =
      type === "inout"
        ? "EMP1000,25/01/25,11:15,18:30\nEMP1611,10/05/25,10:30,19:15"
        : "EMP1000,25/02/25,0,Sick,Doctor's appointment,851616\nEMP1611,10/05/25,10,,,,1";

    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${sampleData}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${type}_sample.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Sample file download started!");
  };

  const handleDeleteRow = (id: number) => {
    setPreviewData((prev) => prev.filter((row) => row.id !== id));
    toast.success("Row removed from preview.", {
      icon: "🗑️",
    });
  };

  const handleSubmit = async () => {
    if (previewData.length === 0 || !previewFileType) {
      toast.error("No data to submit. Please upload and preview a file.");
      return;
    }

    const recordsToSubmit = previewData.map(({ id, ...rest }) => rest);

    const actionToDispatch =
      previewFileType === "attendance"
        ? addAttendanceWithLeave({ records: recordsToSubmit })
        : addAttendance({ records: recordsToSubmit });

    await toast.promise(
      dispatch(actionToDispatch).unwrap(),
      {
        loading: "Submitting attendance data...",
        success: () => {
          setPreviewData([]);
          setTableColumns([]);
          setPreviewFileType(null);
          setAttendanceFile(null);
          setInOutFile(null);
          return "Attendance submitted successfully!";
        },
        error: (err: any) =>
          `Submission failed: ${err.message || "Please try again."}`,
      },
      {
        success: {
          className: "bg-green-100 text-green-800",
          duration: 4000,
        },
        error: {
          className: "bg-red-100 text-red-800",
          duration: 6000,
        },
      }
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* <div className="mb-6">
        <nav className="text-sm" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <span className="text-gray-500">Dashboard</span>
              <span className="mx-2 text-gray-400">/</span>
            </li>
            <li className="flex items-center">
              <span className="text-gray-500">Attendance</span>
              <span className="mx-2 text-gray-400">/</span>
            </li>
            <li className="text-gray-800 font-medium">Upload Attendance</li>
          </ol>
        </nav>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">
          Team Attendance
        </h1>
      </div> */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FileUploadArea
            title="UPLOAD ATTENDANCE FILE"
            file={attendanceFile}
            onFileDrop={handleFileDrop(setAttendanceFile)}
            onShowPreview={() => handleShowPreview("attendance")}
            onDownloadSample={() => downloadSampleCSV("attendance")}
          />
          <FileUploadArea
            title="UPLOAD IN/OUT ENTRY"
            file={inOutFile}
            onFileDrop={handleFileDrop(setInOutFile)}
            onShowPreview={() => handleShowPreview("inout")}
            onDownloadSample={() => downloadSampleCSV("inout")}
          />
        </div>
      </div>

      {previewData.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Preview Data
          </h2>

          {error && (
            <p className="text-red-500 mb-4">Last known error: {error}</p>
          )}
          <Table<AttendanceRecord>
            columns={tableColumns}
            data={previewData}
            showPagination={true}
            showSearch={true}
          />
          <div className="flex justify-start mt-6">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-gray-400 disabled:cursor-wait"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadAttendance;
