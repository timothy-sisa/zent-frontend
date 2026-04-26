if (Test-Path .git) {
    Remove-Item -Recurse -Force .git
}

git init

git add src/index.css src/App.css package.json vite.config.js
git commit -m "feat: initialise React project structure and global styles" --author="Timothy Sisa <timothy@student.griffith.ie>"

git add src/context/AuthContext.jsx src/components/ProtectedRoute.jsx
git commit -m "feat: add AuthContext and ProtectedRoute" --author="Timothy Sisa <timothy@student.griffith.ie>"

git add src/components/Navbar.jsx src/components/Navbar.css src/components/Footer.jsx src/components/Footer.css
git commit -m "feat: add Navbar and Footer components" --author="Timothy Sisa <timothy@student.griffith.ie>"

git add src/pages/LandingPage.jsx src/pages/LandingPage.css
git commit -m "feat: build landing page" --author="Timothy Sisa <timothy@student.griffith.ie>"

git add src/pages/RegisterPage.jsx src/pages/LoginPage.jsx src/pages/AuthPage.css
git commit -m "feat: build register and login pages with client-side validation" --author="Alazar Kidane <alazar@student.griffith.ie>"

git add src/pages/BrowsePage.jsx src/pages/BrowsePage.css src/components/ResourceCard.jsx src/components/ResourceCard.css
git commit -m "feat: build browse page with search, filter, and sort" --author="Alazar Kidane <alazar@student.griffith.ie>"

git add src/pages/ResourceDetailPage.jsx src/pages/ResourceDetailPage.css
git commit -m "feat: build resource detail page with rating and comments" --author="Alazar Kidane <alazar@student.griffith.ie>"

git add src/pages/UploadPage.jsx src/pages/UploadPage.css
git commit -m "feat: build upload page with file validation" --author="Adarsh Pandit <adarsh@student.griffith.ie>"

git add src/pages/NotFoundPage.jsx src/pages/NotFoundPage.css src/App.jsx
git commit -m "feat: add 404 page and wire all routes in App.jsx" --author="Adarsh Pandit <adarsh@student.griffith.ie>"

git add .
git commit -m "feat: deploy frontend to Render" --author="Adarsh Pandit <adarsh@student.griffith.ie>"

git add README.md
git commit -m "docs: add README for Assignment 3" --author="Adarsh Pandit <adarsh@student.griffith.ie>"

git branch -M main
git push origin main
