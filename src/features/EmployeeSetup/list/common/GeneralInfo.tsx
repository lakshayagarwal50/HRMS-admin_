// import React from "react";
// import type { EmployeeDetail } from "../../../../store/slice/employeeSlice";
// import { DetailItem, SectionHeader, EditButton } from "../common/DetailItem";
// // --- 1. IMPORT THE LOGIN DETAILS COMPONENT ---
// import LoginDetails from "./LoginDetails"; // Adjust the path if necessary

// interface GeneralInfoProps {
//   data: EmployeeDetail;
//   onEdit: () => void;
//   // --- 2. ADD employeeId TO THE PROPS ---
//   // This is needed to pass down to the LoginDetails component for API calls
//   employeeId: string;
// }

// const GeneralInfo: React.FC<GeneralInfoProps> = ({
//   data,
//   onEdit,
//   employeeId,
// }) => {
//   const { general } = data;
//   const fullName = `${general.name.first || ""} ${
//     general.name.last || ""
//   }`.trim();

//   return (
//     // --- 3. WRAP EVERYTHING IN A FRAGMENT ---
//     <>
//       <div>
//         <SectionHeader
//           title="General Info"
//           action={<EditButton onClick={onEdit} />}
//         />
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

//       {/* --- 4. ADD THE LOGIN DETAILS COMPONENT BELOW --- */}
//       {/* It receives the full employee data and the employeeId */}
//       <LoginDetails employee={data} employeeId={employeeId} />
//     </>
//   );
// };

// export default GeneralInfo;
// import React from "react";
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
//   const { general } = data;
//   const fullName = `${general.name.first || ""} ${
//     general.name.last || ""
//   }`.trim();

//   // --- 1. Handler for the profile picture edit button ---
//   // You can connect this to your image upload logic
//   const handleImageEditClick = () => {
//     console.log("Edit profile picture clicked!");
//     // TODO: Add logic to open file selector or modal for image upload
//   };

//   return (
//     <>
//       <div>
//         <SectionHeader
//           title="General Info"
//           action={<EditButton onClick={onEdit} />}
//         />

//         {/* --- 2. PROFILE PICTURE SECTION --- */}
//         <div className="flex justify-center py-6">
//           <div className="relative">
//             {/* Circular Image Placeholder */}
//             <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
//               {/* Placeholder User Icon SVG */}
//               <svg
//                 className="w-20 h-20 text-gray-400"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
//                   clipRule="evenodd"
//                 ></path>
//               </svg>
//             </div>

//             {/* Edit Icon Button on Profile Picture */}
//             <button
//               onClick={handleImageEditClick}
//               className="absolute bottom-1 right-1 bg-[#741CDD] text-white rounded-full p-2 focus:outline-none cursor-pointer"
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
//         {/* --- END OF PROFILE PICTURE SECTION --- */}

//         <div className="space-y-2">
//           <DetailItem label="Name" value={fullName} />
//           <DetailItem label="Employee ID" value={general.empCode} />
//           <DetailItem label="Status" value={general.status} />
//           {/* NOTE: You have DOB, PAN, etc. in your screenshot. Add them back here if needed */}
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
  // --- 2. SETUP REDUX AND REFS ---
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.employees); // Get loading state from slice
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden file input

  const { general } = data;
  const fullName = `${general.name.first || ""} ${
    general.name.last || ""
  }`.trim();

  // --- 3. EVENT HANDLERS FOR FILE UPLOAD ---

  // This is triggered when the user clicks the purple edit button
  const handleImageEditClick = () => {
    // Programmatically click the hidden file input to open the file dialog
    fileInputRef.current?.click();
  };

  // This is triggered after the user selects a file from the dialog
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return; // Exit if no file was selected
    }

    // Validation: Check if the image size is over 5MB
    const FIVE_MB = 5 * 1024 * 1024;
    if (file.size > FIVE_MB) {
      alert("File is too large. Please select an image smaller than 5MB.");
      return; // Exit if the file is too big
    }

    // If validation passes, dispatch the upload action
    dispatch(uploadProfilePicture({ employeeCode: employeeId, file }));
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
            {/* --- 4. CONDITIONAL IMAGE DISPLAY --- */}
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {general.profile ? (
                // If a profile URL exists, render the <img> tag
                <img
                  src={general.profile}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                // Otherwise, render the placeholder SVG icon
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

            {/* --- 5. HIDDEN FILE INPUT & UPLOAD BUTTON --- */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/gif"
              style={{ display: "none" }}
            />

            <button
              onClick={handleImageEditClick}
              disabled={loading} // Button is disabled when loading is true
              className="absolute bottom-1 right-1 bg-[#741CDD] text-white rounded-full p-2 hover:bg-[#6317bc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#741CDD] transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
              aria-label="Edit profile picture"
            >
              {/* Pencil Icon SVG */}
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
