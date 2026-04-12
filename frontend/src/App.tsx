import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CatalogPage } from "./pages/CatalogPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ProductFormPage } from "./pages/ProductFormPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/produtos/novo" element={<ProductFormPage />} />
        <Route path="/produtos/:id" element={<ProductDetailPage />} />
        <Route path="/produtos/:id/editar" element={<ProductFormPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
