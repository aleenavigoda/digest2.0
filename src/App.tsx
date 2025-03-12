
import subframeLogo from "./assets/subframe-logo.svg?url"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookshelfPage from "./pages/BookshelfPage";
import Neo4jBrowserPage from "./pages/Neo4jBrowserPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookshelfPage />} />
        <Route path="/neo4j" element={<Neo4jBrowserPage />} />
      </Routes>
    </BrowserRouter>
  );
}
