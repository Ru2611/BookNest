import React from "react";
// main.jsx


import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./Components/Header";

import { Home } from "./Page/Home";
import BookDetail from "./Page/BookDetail";
import Browse from "./Page/browse";
import AddBook from "./Page/addBook";
import Wishlist from "./Page/wishlist";
import AuthPage from "./Page/auth";
import { isLoggedIn } from "./lib/auth";

function RequireAuth({ children }) {
  const location = useLocation();
  if (!isLoggedIn()) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }
  return children;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/browse"
            element={
              <RequireAuth>
                <Browse />
              </RequireAuth>
            }
          />
          <Route
            path="/add"
            element={
              <RequireAuth>
                <AddBook />
              </RequireAuth>
            }
          />
          <Route
            path="/wishlist"
            element={
              <RequireAuth>
                <Wishlist />
              </RequireAuth>
            }
          />
          <Route
            path="/books/:id"
            element={
              <RequireAuth>
                <BookDetail />
              </RequireAuth>
            }
          />
          <Route path="*" element={<p className="p-4">Page not found.</p>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
