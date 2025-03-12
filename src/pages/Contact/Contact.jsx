import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FaTelegramPlane, FaCopy } from "react-icons/fa";
import "../../scss/common.scss";
import "./Contact.scss";

const Contact = () => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const email = "SaintTime@proton.me";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="contact">
      {/* =====Breadcrumbs=====START */}
      <nav className="breadcrumb">
        <a href="/" className="breadcrumb-item">
          <FontAwesomeIcon icon={faHouse} className="icon" />
          {t("breadcrumb.home")}
        </a>
        <span className="breadcrumb-separator"> &gt; </span>
        <span className="breadcrumb-current">{t("breadcrumb.contact")}</span>
      </nav>
      {/* =====Breadcrumbs=====END */}
      <h1 className="contact__title">{t("contact.title")}</h1>
      <h2 className="contact__subtitle">{t("contact.subtitle")}</h2>
      <div className="contact__content">
        <div className="contact__info">
          <FaTelegramPlane className="telegram-icon" />
          <div>
            <p className="contact__label">Telegram</p>
            <p className="contact__email">{email}</p>
          </div>
        </div>
        <button className="copy-button" onClick={copyToClipboard}>
          <FaCopy /> {copied ? t("contact.copied") : t("contact.copy")}
        </button>
      </div>
    </div>
  );
};

export default Contact;
