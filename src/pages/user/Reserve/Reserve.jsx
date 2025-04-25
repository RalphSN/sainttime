import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./Reserve.scss";

const Reserve = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="reserve">
      <button onClick={() => navigate(-1)} className="btn--back">
        ← {t("complaint.back")}
      </button>
      <h2 className="reserve__title">{t("reserve.title")}</h2>
    </div>
  );
};

export default Reserve;
