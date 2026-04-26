# ZENT - Centralized Academic Resource Platform

**Live Deployment URL:** [https://zent-frontend.onrender.com](https://zent-frontend.onrender.com)  
*(Note: Since this is the frontend-only milestone, API requests are mocked locally and will not persist data.)*

## Overview
ZENT is a Centralized Academic Resource Platform designed to allow students and lecturers to easily share, discover, and discuss academic materials like lecture notes, past papers, and study guides. 

This repository contains the source code for the **Assignment 3 Frontend UI Milestone**, built with React.js. It features a complete implementation of the "Academic Light" UI proposed in Assignment 1, consisting of 6 fully interactive pages with client-side validation, mock API interactions, and responsive design.

---

## Division of Labour & Contributions

**Work was evenly divided** among all team members (approx. 33.3% each). Below is a breakdown of the specific components, files, and functionalities handled by each member during this iteration, which accurately reflects our commit history.

### Timothy Sisa
*timothy@student.griffith.ie*
- **Role:** Project setup, Global Styling, Layout Shell, Landing Page
- **Contributions:**
  - Initialized the React project structure with Vite.
  - Set up global design tokens (`index.css`) matching the "Academic Light" proposal.
  - Built the `Navbar` and `Footer` layout shell.
  - Implemented the `AuthContext` for global session state and `ProtectedRoute` routing wrappers.
  - Developed the animated, responsive `LandingPage` with decorative blobs.
- **Authored Files:**
  - `src/App.css`, `src/index.css`
  - `src/context/AuthContext.jsx`
  - `src/components/ProtectedRoute.jsx`, `Navbar.jsx`, `Footer.jsx` (and associated CSS)
  - `src/pages/LandingPage.jsx`, `LandingPage.css`

### Alazar Kidane
*alazar@student.griffith.ie*
- **Role:** Authentication Flow, Resource Catalog, Detail Views
- **Contributions:**
  - Built the `RegisterPage` and `LoginPage` with comprehensive client-side form validation (email format, password matching, length checks).
  - Developed the `BrowsePage` featuring live client-side search, filtering (by category), and sorting functionality.
  - Created the shared `ResourceCard` component.
  - Developed the `ResourceDetailPage`, implementing the star-rating UI and the interactive comment CRUD system.
- **Authored Files:**
  - `src/pages/RegisterPage.jsx`, `LoginPage.jsx`, `AuthPage.css`
  - `src/pages/BrowsePage.jsx`, `BrowsePage.css`
  - `src/components/ResourceCard.jsx`, `ResourceCard.css`
  - `src/pages/ResourceDetailPage.jsx`, `ResourceDetailPage.css`

### Adarsh Pandit
*adarsh@student.griffith.ie*
- **Role:** Data Entry/Uploads, Routing Architecture, Deployment
- **Contributions:**
  - Built the `UploadPage` encompassing complex file validations (type and size checking) for multipart/form-data.
  - Designed the robust drag-and-drop file upload UI.
  - Wired up all application routes inside `App.jsx`, ensuring `ProtectedRoute` barriers worked correctly.
  - Designed and implemented the fallback `NotFoundPage` (404) and generic UI fallback components (`ErrorBanner`, `LoadingSpinner`).
  - Handled the CI/CD deployment of the frontend to Render.com.
- **Authored Files:**
  - `src/App.jsx`
  - `src/pages/UploadPage.jsx`, `UploadPage.css`
  - `src/pages/NotFoundPage.jsx`, `NotFoundPage.css`
  - `src/components/ErrorBanner.jsx`, `LoadingSpinner.jsx`
  - `README.md` documentation

---

## References & Third-Party Resources
- Icons provided by [Lucide React](https://lucide.dev/).
- Fonts (`Inter` and `Roboto`) served via [Google Fonts](https://fonts.google.com/).
- Deployment hosted via [Render](https://render.com/).
- React Router documentation used for SPA navigation.
