# ZENT – Centralized Academic Resource Platform

### Web Technologies – Assignment 3: Client-side Components

**Authors:** Timothy Sisa (3142650) · Alazar Kidane (3136216) · Adarsh Pandit (3134329) **Module:** Web Technologies · Semester 2 · Griffith College Dublin **Deployed URL:** `https://zent-frontend.onrender.com`

---

## What This Is

ZENT is the React.js frontend for a student-driven academic resource sharing platform. It provides six fully interactive pages allowing users to browse resources, register and log in, upload academic materials, view resource details, rate and comment on resources. All data interactions are mocked client-side in this iteration — no HTTP requests are made to the backend API, but every element clearly maps to a backend endpoint for the next integration stage.

---

## Pages

PageRouteDescriptionLanding`/`Platform introduction with call-to-action buttonsRegister`/register`Account creation form with client-side validationLogin`/login`Login form with error handlingBrowse`/resources`Search, filter by type, and sort the resource libraryResource Detail`/resources/:id`Full resource info, star rating, and commentsUpload`/upload`File upload form with type and size validation (protected)

---

## How to Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Division of Labour

### Timothy Sisa (3142650) — 33%

| Task | Files |
|---|---|
| Project initialisation and Vite setup | `package.json`, `vite.config.js` |
| Global design tokens and CSS reset matching Assignment 1 colour spec | `src/index.css`, `src/App.css` |
| Auth context providing global user state | `src/context/AuthContext.jsx` |
| ProtectedRoute component redirecting unauthenticated users | `src/components/ProtectedRoute.jsx` |
| Navbar with auth-aware links and logout | `src/components/Navbar.jsx`, `Navbar.css` |
| Footer | `src/components/Footer.jsx`, `Footer.css` |
| Landing page with hero, features, and how-it-works sections | `src/pages/LandingPage.jsx`, `LandingPage.css` |

---

### Alazar Kidane (3136216) — 33%

| Task | Files |
|---|---|
| Register page with full client-side validation | `src/pages/RegisterPage.jsx` |
| Login page with error state handling | `src/pages/LoginPage.jsx` |
| Shared auth page styles | `src/pages/AuthPage.css` |
| Browse page with live search, type filter, and sort | `src/pages/BrowsePage.jsx`, `BrowsePage.css` |
| Reusable resource card component | `src/components/ResourceCard.jsx`, `ResourceCard.css` |
| Resource detail page with star rating and comment CRUD | `src/pages/ResourceDetailPage.jsx`, `ResourceDetailPage.css` |
| Deployment to Render | — |

---

### Adarsh Pandit (3134329) — 34%

| Task | Files |
|---|---|
| Upload page with file type and size validation | `src/pages/UploadPage.jsx`, `UploadPage.css` |
| 404 Not Found page | `src/pages/NotFoundPage.jsx`, `NotFoundPage.css` |
| App.jsx — all routes wired with ProtectedRoute | `src/App.jsx` |
| Dashboard page with user profile, uploads, and favourites | `src/pages/DashboardPage.jsx`, `DashboardPage.css` |
| ErrorBanner and LoadingSpinner utility components | `src/components/ErrorBanner.jsx`, `LoadingSpinner.jsx` |
| README documentation | `README.md` |

---

## References

- React.js: <https://react.dev/>
- React Router: <https://reactrouter.com/>
- Vite: <https://vitejs.dev/>
- Google Fonts (Inter, Roboto): <https://fonts.google.com/>
- Render deployment: <https://render.com/docs/deploy-a-static-site>
- Assignment 1 colour and font specification: project proposal document
