import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

function Layout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet /> {/* 這裡會動態插入子頁面內容 */}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
