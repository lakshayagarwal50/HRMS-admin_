# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

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