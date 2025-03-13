import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FaEnvelope, FaCopy } from "react-icons/fa";
import "../../scss/common.scss";
import "./Business.scss";

const Business = () => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const email = "SaintTime.bd2@gmail.com";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="business">
      {/* =====Breadcrumbs=====START */}
      <nav className="breadcrumb">
        <a href="/" className="breadcrumb-item">
          <FontAwesomeIcon icon={faHouse} className="icon" />
          {t("breadcrumb.home")}
        </a>
        <span className="breadcrumb-separator"> &gt; </span>
        <span className="breadcrumb-current">{t("breadcrumb.business")}</span>
      </nav>
      {/* =====Breadcrumbs=====END */}
      <h1 className="business__title">{t("business.title")}</h1>
      <h2 className="business__subtitle">{t("business.subtitle")}</h2>
      <div className="business__content">
        <div className="business__info">
          <FaEnvelope className="mail-icon" />
          <div>
            <p className="business__label">E-mail</p>
            <p className="business__email">{email}</p>
          </div>
        </div>
        <button className="copy-button" onClick={copyToClipboard}>
          <FaCopy /> {copied ? t("business.copied") : t("business.copy")}
        </button>
      </div>
    </div>
  );
};

export default Business;
