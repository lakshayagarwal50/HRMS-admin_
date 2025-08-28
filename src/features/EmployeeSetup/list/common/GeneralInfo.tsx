// import React, { useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";

// // --- 1. ADJUST THESE IMPORT PATHS TO MATCH YOUR PROJECT STRUCTURE ---
// import type { AppDispatch, RootState } from "../../../../store/store";
// import { uploadProfilePicture } from "../../../../store/slice/employeeSlice";
// import type { EmployeeDetail } from "../../../../store/slice/employeeSlice";

// import { DetailItem, SectionHeader, EditButton } from "../common/DetailItem";
// import LoginDetails from "./LoginDetails";

// interface GeneralInfoProps {
//   data: EmployeeDetail;
//   onEdit: () => void;
//   employeeId: string;
// }

// const GeneralInfo: React.FC<GeneralInfoProps> = ({
//   data,
//   onEdit,
//   employeeId,
// }) => {
//   // --- 2. SETUP REDUX AND REFS ---
//   const dispatch = useDispatch<AppDispatch>();
//   const { loading } = useSelector((state: RootState) => state.employees); // Get loading state from slice
//   const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden file input

//   const { general } = data;
//   const fullName = `${general.name.first || ""} ${
//     general.name.last || ""
//   }`.trim();

//   // --- 3. EVENT HANDLERS FOR FILE UPLOAD ---

//   // This is triggered when the user clicks the purple edit button
//   const handleImageEditClick = () => {
//     // Programmatically click the hidden file input to open the file dialog
//     fileInputRef.current?.click();
//   };

//   // This is triggered after the user selects a file from the dialog
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];

//     if (!file) {
//       return; // Exit if no file was selected
//     }

//     // Validation: Check if the image size is over 5MB
//     const FIVE_MB = 5 * 1024 * 1024;
//     if (file.size > FIVE_MB) {
//       alert("File is too large. Please select an image smaller than 5MB.");
//       return; // Exit if the file is too big
//     }

//     // If validation passes, dispatch the upload action
//     dispatch(uploadProfilePicture({ employeeCode: employeeId, file }));
//   };

//   return (
//     <>
//       <div>
//         <SectionHeader
//           title="General Info"
//           action={<EditButton onClick={onEdit} />}
//         />

//         <div className="flex justify-center py-6">
//           <div className="relative">
//             {/* --- 4. CONDITIONAL IMAGE DISPLAY --- */}
//             <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
//               {general.profile ? (
//                 // If a profile URL exists, render the <img> tag
//                 <img
//                   src={general.profile}
//                   alt="Profile"
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 // Otherwise, render the placeholder SVG icon
//                 <svg
//                   className="w-20 h-20 text-gray-400"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
//                     clipRule="evenodd"
//                   ></path>
//                 </svg>
//               )}
//             </div>

//             {/* --- 5. HIDDEN FILE INPUT & UPLOAD BUTTON --- */}
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileChange}
//               accept="image/png, image/jpeg, image/gif"
//               style={{ display: "none" }}
//             />

//             <button
//               onClick={handleImageEditClick}
//               disabled={loading} // Button is disabled when loading is true
//               className="absolute bottom-1 right-1 bg-[#741CDD] text-white rounded-full p-2 hover:bg-[#6317bc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#741CDD] transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
//               aria-label="Edit profile picture"
//             >
//               {/* Pencil Icon SVG */}
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
//                 ></path>
//               </svg>
//             </button>
//           </div>
//         </div>

//         <div className="space-y-2">
//           <DetailItem label="Name" value={fullName} />
//           <DetailItem label="Employee ID" value={general.empCode} />
//           <DetailItem label="Status" value={general.status} />
//           <DetailItem label="Gender" value={general.gender} />
//           <DetailItem
//             label="Phone Number"
//             value={`${general.phoneNum.code} ${general.phoneNum.num}`}
//           />
//           <DetailItem label="Email Primary" value={general.primaryEmail} />
//         </div>
//       </div>

//       <LoginDetails employee={data} employeeId={employeeId} />
//     </>
//   );
// };

// export default GeneralInfo;


import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast"; // New: Import toast

// --- 1. ADJUST THESE IMPORT PATHS TO MATCH YOUR PROJECT STRUCTURE ---
import type { AppDispatch, RootState } from "../../../../store/store";
import { uploadProfilePicture } from "../../../../store/slice/employeeSlice";
import type { EmployeeDetail } from "../../../../store/slice/employeeSlice";

import { DetailItem, SectionHeader, EditButton } from "../common/DetailItem";
import LoginDetails from "./LoginDetails";

interface GeneralInfoProps {
  data: EmployeeDetail;
  onEdit: () => void;
  employeeId: string;
}

const GeneralInfo: React.FC<GeneralInfoProps> = ({
  data,
  onEdit,
  employeeId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.employees);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { general } = data;
  const fullName = `${general.name.first || ""} ${
    general.name.last || ""
  }`.trim();

  const handleImageEditClick = () => {
    fileInputRef.current?.click();
  };

  // Modified: handleFileChange is now async and uses toasts for all feedback.
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const FIVE_MB = 5 * 1024 * 1024;
    if (file.size > FIVE_MB) {
      // Replaced alert with a toast notification
      toast.error(
        "File is too large. Please select an image smaller than 5MB.",
        {
          className: "bg-orange-50 text-orange-800",
        }
      );
      return;
    }

    const toastId = toast.loading("Uploading picture...");

    try {
      // Dispatch the upload action and wait for it to complete
      await dispatch(
        uploadProfilePicture({ employeeCode: employeeId, file })
      ).unwrap();

      toast.success("Profile picture updated successfully!", {
        id: toastId,
        className: "bg-green-50 text-green-800",
      });
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to upload picture. Please try again.", {
        id: toastId,
        className: "bg-red-50 text-red-800",
      });
    }
  };

  return (
    <>
      <div>
        <SectionHeader
          title="General Info"
          action={<EditButton onClick={onEdit} />}
        />

        <div className="flex justify-center py-6">
          <div className="relative">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {general.profile ? (
                <img
                  src={general.profile}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="w-20 h-20 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/gif"
              style={{ display: "none" }}
            />

            <button
              onClick={handleImageEditClick}
              disabled={loading}
              className="absolute bottom-1 right-1 bg-[#741CDD] text-white rounded-full p-2 hover:bg-[#6317bc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#741CDD] transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
              aria-label="Edit profile picture"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <DetailItem label="Name" value={fullName} />
          <DetailItem label="Employee ID" value={general.empCode} />
          <DetailItem label="Status" value={general.status} />
          <DetailItem label="Gender" value={general.gender} />
          <DetailItem
            label="Phone Number"
            value={`${general.phoneNum.code} ${general.phoneNum.num}`}
          />
          <DetailItem label="Email Primary" value={general.primaryEmail} />
        </div>
      </div>

      <LoginDetails employee={data} employeeId={employeeId} />
    </>
  );
};

export default GeneralInfo;