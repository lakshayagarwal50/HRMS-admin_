// // src/components/layout/AuthLayout.tsx
// import { Outlet } from 'react-router-dom';

// const AuthLayout = () => (
//   <>
//       <div className='h-screen w-1/2 flex items-center'><img src="/Gemini_Generated_Image_vq7ospvq7ospvq7o.jpeg" alt="" /></div>

//   <div className="flex items-center justify-end h-screen bg-gray-100">
//     <Outlet />
//   </div>
  
//   </>
// );

// export default AuthLayout;

// src/components/layout/AuthLayout.tsx

// import { Outlet } from 'react-router-dom';

// const AuthLayout = () => (
//   <div className="flex h-screen w-screen">
//     {/* Left side with image */}
//     <div className="w-1/2 flex items-center justify-center bg-black">
//       <img
//         src="/Gemini_Generated_Image_vq7ospvq7ospvq7o.jpeg"
//         alt="Auth Visual"
//         className="max-w-full max-h-full object-cover"
//       />
//     </div>

//     {/* Right side with login form */}
//     <div className="w-1/2 flex items-center justify-center bg-gray-100">
//       <Outlet />
//     </div>
//   </div>
// );

// export default AuthLayout;


import { Outlet } from "react-router-dom";

const AuthLayout = () => (
  <div className="flex h-screen w-screen">
    {/* Left side with image (hidden on small devices) */}
    <div className="hidden md:flex w-1/2 h-full items-center justify-center bg-black">
      <img
        src="/Gemini_Generated_Image_vq7ospvq7ospvq7o.jpeg"
        alt="Auth Visual"
        className="h-full w-full object-cover"
      />
    </div>

    {/* Right side with login form */}
    <div className="flex w-full md:w-1/2 h-full items-center justify-center bg-gray-100">
      <Outlet />
    </div>
  </div>
);

export default AuthLayout;
