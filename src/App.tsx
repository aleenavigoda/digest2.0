import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import subframeLogo from "./assets/subframe-logo.svg?url";
import BookshelfPage from "./pages/BookshelfPage";
import LibraryPage from "./pages/LibraryPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Temporarily redirect to library page for testing */}
        <Route path="/" element={<Navigate to="/library?id=bookshelf-1" />} />
        <Route path="/bookshelf" element={<BookshelfPage />} />
        <Route path="/library" element={<LibraryPage />} />
      </Routes>
    </BrowserRouter>
  );
}