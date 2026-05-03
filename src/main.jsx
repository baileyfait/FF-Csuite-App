import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import FFCSuite from "./ff-csuite-app.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FFCSuite />
  </StrictMode>
);
