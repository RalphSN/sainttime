import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./Footer.scss";

const Footer = () => {
  const { t } = useTranslation();
  const imageUrl =
    "https://cdn.jsdelivr.net/gh/RalphSN/images@main/sainttime-images/logo_sainttime.png";

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__logo">
          <img src={imageUrl} alt="Logo" className="logo" />
        </div>
        <div className="footer-info">
          <p className="footer-info__text">{t("footer.adultContentWarning")}</p>
          <div className="footer-info__links">
            <Link to="/terms" className="footer-info__link">
              {t("footer.termsOfService")}
            </Link>
            <Link to="/privacy" className="footer-info__link">
              {t("footer.privacyPolicy")}
            </Link>
            <Link to="/contact" className="footer-info__link">
              {t("footer.contactUs")}
            </Link>
            <Link to="/FAQ" className="footer-info__link">
              {t("footer.faq")}
            </Link>
          </div>
          <p className="footer-info__copyrights">
            Copyright ©2025, OCG GAME Inc. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
