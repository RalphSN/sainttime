import { useTranslation } from "react-i18next";
import "./Reserve.scss";

const Reserve = () => { 
    const { t } = useTranslation();

    return (
        <div className="reserve">
            <h2 className="reserve__title">{t("reserve.title")}</h2>
        </div>
    )};

    export default Reserve;
