# Project Overview

This is a web application built with React, Vite, and TypeScript. It uses Redux Toolkit for state management, Tailwind CSS for styling, and Firebase for backend services. The project is structured by features, with each feature having its own directory containing pages, components, and a Redux slice.

## Building and Running

### Development

To run the development server, use the following command:

```bash
npm run dev
```

### Building

To build the project for production, use the following command:

```bash
npm run build
```

### Linting

To lint the code, use the following command:

```bash
npm run lint
```

### Previewing the Build

To preview the production build, use the following command:

```bash
npm run preview
```

## Development Conventions

*   **State Management:** The project uses Redux Toolkit for state management. Each feature has its own slice, which is a collection of Redux reducer logic and actions for a single feature in the app.
*   **Styling:** The project uses Tailwind CSS for styling.
*   **Routing:** The project uses React Router for routing.
*   **Backend:** The project uses Firebase for backend services.
*   **Type Checking:** The project uses TypeScript for type checking. The `tsconfig.app.json` file includes strict type checking and other linting rules.
