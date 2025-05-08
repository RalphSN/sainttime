import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout/Layout";
import Home from "./pages/Home/Home";
import Login from "./pages/auth/Login/Login";
import Register from "./pages/auth/Register/Register";
import Forgot from "./pages/auth/Forget/ForgotPassword";
import HotFreeGames from "./pages/game/HotFreeGames/HotFreeGames";
import GameDetails from "./pages/game/GameDetails/GameDetails";
import DownloadApple from "./pages/game/DownloadApple/DownloadApple";
import Privacy from "./pages/legal/Privacy/Privacy";
import Contact from "./pages/legal/Contact/Contact";
import Terms from "./pages/legal/Terms/Terms";
import Business from "./pages/legal/Business/Business";
import Faq from "./pages/legal/Faq/Faq";
import NewsPage from "./pages/news/NewsPage/NewsPage";
import NewsDetail from "./pages/news/NewsDetail/NewsDetail";
import Loading from "./components/common/Loading/Loading";
import GiftPackPage from "./pages/game/GiftPackPage/GiftPackPage";
import MemberLayout from "./components/layout/MemberLayout/MemberLayout";
import Points from "./pages/user/Points/Points";
import Recharge from "./pages/user/Recharge/Recharge";
import ComplaintForm from "./pages/user/ComplaintForm/ComplaintForm";
import MyVerification from "./pages/user/MyVerification/MyVerification";
import ChangePassword from "./pages/user/ChangePassword/ChangePassword";
import Reserve from "./pages/user/Reserve/Reserve";
import MemberMobile from "./pages/user/MobileMember/MobileMember";
import MemberRedirect from "./pages/user/MemberRedirect";
import GoTopButton from "./components/common/GoTopButton/GoTopButton";
import AgeGateModal from "./components/common/AgeGateModal/AgeGateModal";
import AppStore from "./pages/legal/AppStore/AppStore";

function App() {
  return (
    <BrowserRouter>
      <AgeGateModal />
      <GoTopButton />
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
          <Route path="/age" element={<AgeGateModal />} />
          <Route path="/appstore" element={<AppStore />} />

          <Route path="member" element={<MemberLayout />}>
            <Route index element={<MemberRedirect />} />
            <Route path="mobile" element={<MemberMobile />} />
            <Route path="points" element={<Points />} />
            <Route path="recharge" element={<Recharge />} />
            <Route path="service" element={<ComplaintForm />} />
            <Route path="certificate" element={<MyVerification />} />
            <Route path="password" element={<ChangePassword />} />
            <Route path="reserve" element={<Reserve />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
