import { useTranslation } from "react-i18next";
import "../../scss/common.scss";
import "./Terms.scss";

const Terms = () => {
  const { t } = useTranslation();

  // 取得 "terms" 內的所有條款資料
  const termsData = t("terms", { returnObjects: true });

  return (
    <div className="terms">
      <h1>{t("terms_title")}</h1> {/* 主要標題 */}
      {Object.entries(termsData).map(([key, term]) => (
        <div key={key} className="term-section">
          <h2>{term.title}</h2>
          {Object.entries(term)
            .filter(([contentKey]) => contentKey.startsWith("content"))
            .map(([contentKey, content]) => {
              // 判斷條款內容的縮進層級
              let className = "content-level-1"; // 預設內縮 1 層
              if (content.match(/^\(\d+\)/)) {
                className = "content-level-2"; // (1), (2) 內縮 2 層
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
