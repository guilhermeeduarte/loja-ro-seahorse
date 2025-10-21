import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Carrinho from "./pages/Carrinho.jsx";
import Contato from "./pages/Contato.jsx";
import Localizacao from "./pages/Localizacao.jsx";
import Faq from "./pages/Faq.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/localizacao" element={<Localizacao />} />
        <Route path="/faq" element={<Faq />} />
      </Routes>
    </Router>
  );
}
