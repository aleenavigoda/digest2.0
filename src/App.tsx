import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import subframeLogo from "./assets/subframe-logo.svg?url";
import BookshelfPage from "./pages/BookshelfPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Make BookshelfPage the default */}
        <Route path="/" element={<Navigate to="/bookshelf" />} />
        <Route path="/bookshelf" element={<BookshelfPage />} />
      </Routes>
    </BrowserRouter>
  );
}