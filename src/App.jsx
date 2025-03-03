import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Navbar from './components/Header/Header';
// import Footer from './components/Footer/Footer';
import Layout from "./components/Layout";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Forgot from "./pages/Forget/ForgotPassword";
import HotFreeGames from "./pages/HotFreeGames/HotFreeGames";
// import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<Forgot />} />
          <Route path="games" element={<HotFreeGames />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
