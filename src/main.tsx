import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { FlightProvider } from "./context/FlightContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FlightProvider>
      <App />
    </FlightProvider>
  </StrictMode>
);
