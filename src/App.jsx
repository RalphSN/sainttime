import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Navbar from './components/Header/Header';
// import Footer from './components/Footer/Footer';
import Layout from "./components/Layout";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Forgot from "./pages/Forget/ForgotPassword";
import HotFreeGames from "./pages/HotFreeGames/HotFreeGames";
import GameDetails from "./pages/GameDetails/GameDetails";
import DownloadApple from "./pages/DownloadApple/DownloadApple";
import Privacy from "./pages/Privacy/Privacy";
import Contact from "./pages/Contact/Contact";
import Terms from "./pages/Terms/Terms";
import Business from "./pages/Business/Business";
import Faq from "./pages/Faq/Faq";
import NewsPage from "./pages/NewsPage/NewsPage";
import NewsDetail from "./pages/NewsDetail/NewsDetail";
import Loading from "./components/Loading/Loading";
import GiftPackPage from "./pages/GiftPackPage/GiftPackPage";
import MemberLayout from "./components/MemberLayout/MemberLayout";
import Points from "./pages/Points/Points";
import Recharge from "./pages/Recharge/Recharge";
import ComplaintForm from "./pages/ComplaintForm/ComplaintForm";

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
          <Route path="game" element={<GameDetails />} />
          <Route path="gameiOS" element={<DownloadApple />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="contact" element={<Contact />} />
          <Route path="business" element={<Business />} />
          <Route path="FAQ" element={<Faq />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/gift" element={<GiftPackPage />} />

          <Route path="member" element={<MemberLayout />}>
            <Route index element={<Navigate to="points" replace />} />
            <Route path="points" element={<Points />} />
            <Route path="recharge" element={<Recharge />} />
            <Route path="service" element={<ComplaintForm />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
