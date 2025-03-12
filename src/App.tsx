import { BrowserRouter, Routes, Route } from "react-router-dom";
import subframeLogo from "./assets/subframe-logo.svg?url";
import BookshelfPage from "./pages/BookshelfPage";
import LibraryPage from "./pages/LibraryPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookshelfPage />} />
        <Route path="/library" element={<LibraryPage />} />
      </Routes>
    </BrowserRouter>
  );
}