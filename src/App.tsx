import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookshelfPage from "./pages/BookshelfPage";
import LibraryPage from "./pages/LibraryPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookshelfPage />} />
        <Route path="/library/:id" element={<LibraryPage />} />
      </Routes>
    </Router>
  );
}