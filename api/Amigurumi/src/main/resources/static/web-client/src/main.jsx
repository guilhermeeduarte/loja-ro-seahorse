import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home.jsx"; // relativo a src/
import "./styles.css";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);