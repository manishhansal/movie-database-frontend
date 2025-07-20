# Movie Database Frontend

This is a modern Movie Database web application built with [Next.js](https://nextjs.org), React, and TypeScript. It features authentication, full movie CRUD, search, pagination, and a beautiful, responsive UI.

## Features

- **Authentication**: Signup, login, and logout with JWT token storage
- **Movie CRUD**: Add, edit, delete, and view movie details
- **Search & Pagination**: Search movies by name/description and paginate results
- **Image Previews**: Upload and preview images for movies (optional, placeholder only)
- **Responsive UI**: Clean, modern design with custom modals and toasts
- **API Integration**: Connects to a backend at `http://localhost:9000` (configurable)
- **Protected Routes**: Only logged-in users can access dashboard and movie pages
- **Custom Modals**: For delete confirmations and error handling

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Configure API base URL (optional):**
   - By default, the app uses `http://localhost:9000` for API calls.
   - To change, set the environment variable `NEXT_PUBLIC_API_BASE_URL` in a `.env.local` file:
     ```env
     NEXT_PUBLIC_API_BASE_URL=http://your-api-url:9000
     ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Login/Signup:**
  - Visit `/login` or `/signup` to create an account or log in.
- **Dashboard:**
  - After login, view all movies, search, paginate, add, edit, or delete movies.
- **Add/Edit Movie:**
  - Use the form to add or edit movies. Image upload is for preview only.
- **Movie Details:**
  - Click a movie card to view details, edit, or delete the movie.
- **Logout:**
  - Use the logout button in the dashboard header.

## Tech Stack
- Next.js (React, TypeScript)
- Formik & Yup (forms and validation)
- react-toastify (toasts)
- Custom CSS (responsive, modern UI)

## API
- Expects a backend at `http://localhost:9000` with endpoints for authentication and movies CRUD.
- See `api/auth.ts` and `api/movies.ts` for details.

## Customization
- To enable real image uploads, update the API and form logic in `add-movie.tsx` and `edit-movie.tsx`.
- To change the UI, edit styles in `styles/globals.css` and components in `components/`.

---

Built with ❤️ using Next.js and React.
