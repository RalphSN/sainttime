import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import "../../../scss/common.scss";
import "./AppStore.scss";

const AppStore = () => {
  const { t } = useTranslation();
  return (
    <div className="app-store">
      {/* =====Breadcrumbs=====START */}
      <nav className="breadcrumb">
        <a href="/" className="breadcrumb-item">
          <FontAwesomeIcon icon={faHouse} className="icon" />
          {t("breadcrumb.home")}
        </a>
        <span className="breadcrumb-separator"> &gt; </span>
        <span className="breadcrumb-current">App Store</span>
      </nav>
      {/* =====Breadcrumbs=====END */}
      <h1 className="app-store__title">App Store</h1>

      <figure className="app-store__img-container">
        <img
          src="https://cdn.jsdelivr.net/gh/RalphSN/ocg-landing/images/appstore.png"
          alt="App Store"
        className="app-store__img"
        />
      </figure>
    </div>
  );
};

export default AppStore;
