import { useState, useEffect, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faGamepad,
  faGift,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import { AuthContext } from "../../../context/AuthContext"; // 使用 AuthContext
import "./Header.scss";

const Header = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useContext(AuthContext); // 直接從 AuthContext 取得 user & logout
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language || "en");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const imageUrl =
    "https://cdn.jsdelivr.net/gh/RalphSN/images@main/sainttime-images/logo_sainttime.png";

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 如果username是email格式，則只取@之前的內容
  const displayName = user?.username.includes("@")
    ? user.username.split("@")[0]
    : user?.username || "";

  // 切換語言
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng).then(() => {
      localStorage.setItem("i18nextLng", lng);
      setCurrentLang(lng);
      setDropdownOpen(false);
      closeMenuOnNavigate();
    });
  };

  // 導航時關閉側邊欄
  const closeMenuOnNavigate = () => {
    setOverlayVisible(false);
    setIsMenuOpen(false);
    setTimeout(() => setShowOverlay(false), 350);
  };

  // 切換語言選單開關
  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => !prev);
  };

  // 偵測點擊事件，若點擊語言選單外部則關閉選單
  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  // 處理漢堡選單開關
  const handleMenuToggle = () => {
    if (!isMenuOpen) {
      setShowOverlay(true);
      setIsMenuOpen(true);
      setTimeout(() => setOverlayVisible(true), 10);
    } else {
      closeMenuOnNavigate();
    }
  };

  // 導覽連結
  const navLinks = [
    { key: "navbar.home", to: "/" },
    { key: "navbar.popularGames", to: "/games" },
    { key: "navbar.gift", to: "/gift" },
    ...(user ? [{ key: "navbar.member", to: "/member" }] : []),
  ];

  // 語言選單
  const languages = [
    { code: "en", label: t("languages.en") },
    { code: "zh-TW", label: t("languages.zh-TW") },
    { code: "zh-CN", label: t("languages.zh-CN") },
    { code: "zh-HK", label: t("languages.zh-HK") },
  ];

  // 判斷當前路徑
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {isMobile && (
        <nav className="mobile-nav">
          {(() => {
            const iconMap = {
              "navbar.home": faHouse,
              "navbar.popularGames": faGamepad,
              "navbar.gift": faGift,
              "navbar.member": faUser,
            };

            return navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.to}
                className={`mobile-nav__item ${
                  isActive(link.to) ? "active" : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={iconMap[link.key]}
                  className="mobile-nav__icon"
                />
                <div className="mobile-nav__label">{t(link.key)}</div>
              </Link>
            ));
          })()}
        </nav>
      )}
      <header className="navbar">
        <div className="navbar__container">
          <div className="navbar__logo">
            <img src={imageUrl} alt="Logo" className="logo" />
          </div>
        </div>

        {/* 漢堡選單按鈕（小螢幕才顯示） */}
        <button className="hamburger-menu" onClick={handleMenuToggle}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </button>

        {/* 背景遮罩 */}
        {showOverlay && (
          <div
            className={`menu-overlay ${overlayVisible ? "open" : ""}`}
            onClick={closeMenuOnNavigate} // 點擊時關閉選單
          ></div>
        )}

        {/* 右側滑出選單 */}
        <div className={`navbar-auth__slide ${isMenuOpen ? "open" : ""}`}>
          <button className="close-menu" onClick={handleMenuToggle}>
            ×
          </button>

          {/* 導覽連結 */}
          <ul className="navbar__links">
            {navLinks.map((link) => (
              <li key={link.key} className="navbar__link">
                <Link to={link.to} onClick={closeMenuOnNavigate}>
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>

          {/* 登入 / 註冊 or 會員狀態 */}
          <div className="navbar-auth__slide-box">
            {user ? (
              <>
                <span className="user-greeting">
                  {displayName}，{t("navbar.hello")}!
                </span>
                <button
                  className="btn btn--logout"
                  onClick={() => {
                    logout();
                    localStorage.removeItem("userId");
                    closeMenuOnNavigate();
                    window.location.href = "/";
                  }}
                >
                  {t("navbar.logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn--login"
                  onClick={closeMenuOnNavigate}
                >
                  {t("navbar.login")}
                </Link>
                <Link
                  to="/register"
                  className="btn btn--register"
                  onClick={closeMenuOnNavigate}
                >
                  {t("navbar.register")}
                </Link>
              </>
            )}

            {/* 語言切換選單 */}
            <div
              className={`language-dropdown ${dropdownOpen ? "open" : ""}`}
              ref={dropdownRef}
            >
              <button
                className="dropdown-toggle"
                onClick={handleDropdownToggle}
              >
                {t(`languages.${currentLang}`) || t("navbar.language")}
              </button>
              {dropdownOpen && (
                <ul className="dropdown-menu">
                  {languages.map((lang) => (
                    <li
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                    >
                      <a href="#">{lang.label}</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
