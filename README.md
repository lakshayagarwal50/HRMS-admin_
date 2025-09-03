
src/
├── assets/                     # Static assets
│   ├── img/                   # Images, SVGs
│   ├── styles/                # Tailwind CSS or global styles
│   └── fonts/                 # Custom fonts
│
├── components/                # Reusable UI components
│   ├── common/                # Shared components (Button, Input, Modal)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   └── layout/                # Layout components (Sidebar, Header)
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       ├── AdminLayout.tsx
│       └── AuthLayout.tsx
│
├── features/                  # Feature-based modules
│   ├── auth/                  # Authentication module
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── ForgotPassword.tsx
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── PasswordResetForm.tsx
│   │   └── authSlice.ts       # RTK slice for auth
│   ├── employee/              # Employee management module
│   │   ├── pages/
│   │   │   ├── EmployeeList.tsx
│   │   │   └── EmployeeDetails.tsx
│   │   ├── components/
│   │   │   ├── EmployeeForm.tsx
│   │   │   └── EmployeeTable.tsx
│   │   └── employeeSlice.ts   # RTK slice for employees
│   ├── payroll/               # Payroll module
│   │   ├── pages/
│   │   │   ├── PayrollDashboard.tsx
│   │   │   └── PayrollHistory.tsx
│   │   ├── components/
│   │   │   ├── PayrollForm.tsx
│   │   │   └── PayrollTable.tsx
│   │   └── payrollSlice.ts    # RTK slice for payroll
│   ├── attendance/            # Attendance module
│   │   ├── pages/
│   │   ├── components/
│   │   └── attendanceSlice.ts
│   ├── reports/               # Reports module
│   │   ├── pages/
│   │   ├── components/
│   │   └── reportsSlice.ts
│
├── hooks/                     # Custom hooks
│   ├── useAuth.ts
│   ├── useFirestore.ts
│   └── usePayroll.ts
│
├── routes/                    # Route definitions and logic
│   ├── AppRoutes.tsx
│   └── ProtectedRoute.tsx
│
├── services/                  # Firebase and API services
│   ├── firebase/
│   │   ├── auth.ts           # Firebase auth methods
│   │   ├── firestore.ts      # Firestore queries
│   │   └── storage.ts        # Firebase storage
│   └── index.ts              # Service exports
│
├── store/                     # RTK store configuration
│   ├── slices/               # Feature slices (optional, if not in features/)
│   │   └── index.ts
│   └── store.ts              # Store setup
│
├── types/                     # TypeScript types and interfaces
│   ├── auth.ts
│   ├── employee.ts
│   ├── payroll.ts
│   └── index.ts              # Type exports
│
├── utils/                     # Utility functions and constants
│   ├── constants.ts
│   ├── formatters.ts         # Date, currency formatters
│   └── validators.ts         # Form validation
│
├── tests/                     # Unit tests
│   ├── auth/
│   ├── employee/
│   └── payroll/
│
├── App.tsx                    # App entry with providers (Redux, Router)
├── main.tsx                   # Renders App to DOM
├── index.css                  # Global styles (Tailwind or custom)
├── vite.config.ts
└── vite-env.d.ts

