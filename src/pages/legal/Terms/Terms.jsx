import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import "../../../scss/common.scss";
import "./Terms.scss";

const Terms = () => {
  const { t } = useTranslation();

  // 取得 "terms" 內的所有條款資料
  const termsData = t("terms", { returnObjects: true });

  return (
    <div className="terms">
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
      <h1 className="terms__title">{t("terms.title")}</h1>
      {Object.entries(termsData).map(([key, term]) => (
        <div key={key} className="term__section">
          <h2 className="term__section-title">{term.title}</h2>
          {Object.entries(term)
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

export default Terms;
