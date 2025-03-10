import { useTranslation } from "react-i18next";
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
            <a href="#" className="footer-info__link">{t("footer.termsOfService")}</a>
            <a href="#" className="footer-info__link">{t("footer.privacyPolicy")}</a>
            <a href="#" className="footer-info__link">{t("footer.contactUs")}</a>
          </div>
          <p className="footer-info__copyrights">Copyright ©2025, OCG GAME Inc. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
