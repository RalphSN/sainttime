import { useTranslation } from "react-i18next";
import "./footer.scss";

const Footer = () => {
  const { t } = useTranslation();
  const imageUrl =
    "https://cdn.jsdelivr.net/gh/RalphSN/images@main/sainttime-images/logo_sainttime.png";

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src={imageUrl} alt="Logo" className="logo" />
        </div>
        <div className="footer-box">
          <p className="footer-text">{t("footer.adultContentWarning")}</p>
          <div className="footer-links">
            <a href="#">{t("footer.termsOfService")}</a>
            <a href="#">{t("footer.privacyPolicy")}</a>
            <a href="#">{t("footer.contactUs")}</a>
          </div>
          <p className="footer-copyright">Copyright ©2025, OCG GAME Inc. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
