import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./header.scss";

const Header = () => {
  const { t, i18n } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language || "en");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false); // 控制背景遮罩
  const [overlayVisible, setOverlayVisible] = useState(false); // 控制透明度動畫
  const dropdownRef = useRef(null);
  const imageUrl =
    "https://cdn.jsdelivr.net/gh/RalphSN/images@main/sainttime-images/logo_sainttime.png";

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng).then(() => {
      localStorage.setItem("i18nextLng", lng);
      setCurrentLang(lng);
      setDropdownOpen(false);
    });
  };

  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => !prev);
  };

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

  const handleMenuToggle = () => {
    if (!isMenuOpen) {
      setShowOverlay(true); // 先顯示 DOM，讓 display: block 生效
      setTimeout(() => {
        setOverlayVisible(true); // 觸發 opacity 變化
      }, 10); // 延遲 10ms 觸發過渡動畫
      setIsMenuOpen(true);
    } else {
      setOverlayVisible(false); // 讓 opacity 變 0
      setIsMenuOpen(false);
      setTimeout(() => {
        setShowOverlay(false); // 讓 display: none 移除 DOM
      }, 350); // 等待動畫結束後才隱藏
    }
  };

  const navLinks = [
    { key: "navbar.home", to: "/" },
    { key: "navbar.popularGames", to: "/" },
  ];

  const languages = [
    { code: "en", label: t("languages.en") },
    { code: "zh-TW", label: t("languages.zh-TW") },
    { code: "zh-CN", label: t("languages.zh-CN") },
    { code: "zh-HK", label: t("languages.zh-HK") },
  ];

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={imageUrl} alt="Logo" className="logo" />
        </div>
      </div>

      {/* 漢堡選單按鈕（小螢幕才顯示） */}
      <button className="hamburger-menu" onClick={handleMenuToggle}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </button>

      {/* 背景遮罩（帶有淡入淡出動畫） */}
      {showOverlay && (
        <div
          className={`menu-overlay ${showOverlay ? "visible" : ""} ${
            overlayVisible ? "open" : ""
          }`}
          onClick={handleMenuToggle}
        ></div>
      )}

      {/* 右側滑出選單 */}
      <div className={`navbar-auth-slide ${isMenuOpen ? "open" : ""}`}>
        <button className="close-menu" onClick={handleMenuToggle}>
          ×
        </button>
        <ul className="navbar-links">
          {navLinks.map((link) => (
            <li key={link.key}>
              <Link to={link.to}>{t(link.key)}</Link>
            </li>
          ))}
        </ul>
        <div className="navbar-auth-slide-box">
          <Link to="/login" className="btn login">
            {t("navbar.login")}
          </Link>
          <Link to="/register" className="btn register">
            {t("navbar.register")}
          </Link>
          <div
            className={`language-dropdown ${dropdownOpen ? "open" : ""}`}
            ref={dropdownRef}
          >
            <button className="dropdown-toggle" onClick={handleDropdownToggle}>
              {t(`languages.${currentLang}`) || t("navbar.language")}
            </button>
            {dropdownOpen && (
              <ul className="dropdown-menu">
                {languages.map((lang) => (
                  <li key={lang.code} onClick={() => changeLanguage(lang.code)}>
                    <a href="#">{lang.label}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
