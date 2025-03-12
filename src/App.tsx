
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookshelfPage from "./pages/BookshelfPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookshelfPage />} />
        <Route path="/bookshelf" element={<BookshelfPage />} />
      </Routes>
    </BrowserRouter>
  );
}
