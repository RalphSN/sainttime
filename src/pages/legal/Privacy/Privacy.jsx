import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import "../../../scss/common.scss";
import "./Privacy.scss";

const Privacy = () => {
  const { t } = useTranslation();

  // 取得 "privacy" 內的所有條款資料
  const privacyData = t("privacy", { returnObjects: true });

  return (
    <div className="privacy">
      {/* =====Breadcrumbs=====START */}
      <nav className="breadcrumb">
        <a href="/" className="breadcrumb-item">
          <FontAwesomeIcon icon={faHouse} className="icon" />
          {t("breadcrumb.home")}
        </a>
        <span className="breadcrumb-separator"> &gt; </span>
        <span className="breadcrumb-current">{t("breadcrumb.privacy")}</span>
      </nav>
      {/* =====Breadcrumbs=====END */}
      <h1 className="privacy__title">{t("privacy.title")}</h1>
      {Object.entries(privacyData).map(([key, privacy]) => (
        <div key={key} className="privacy__section">
          <h2 className="privacy__section-title">{privacy.title}</h2>
          {Object.entries(privacy)
            .filter(([contentKey]) => contentKey.startsWith("content"))
            .map(([contentKey, content]) => {
              let className = "content-indent"; // 預設所有條款縮排
              if (content.match(/^\d+\./)) {
                className = "content-numbered"; // 1. 這類條款
              } else if (content.match(/^\(\d+\)/)) {
                className = "content-parenthesis"; // (1) 這類條款
              }

              return (
                <p key={contentKey} className={className}>
                  {content}
                </p>
              );
            })}
        </div>
      ))}
    </div>
  );
};

export default Privacy;
