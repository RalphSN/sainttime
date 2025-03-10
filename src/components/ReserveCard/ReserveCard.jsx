import PropTypes from "prop-types"; // 加入 PropTypes 驗證
import { useTranslation } from "react-i18next";
import "./ReserveCard.scss";

const ReserveCard = ({
  title,
  description,
  image,
  buttonText,
  url,
  className = "",
  children,
}) => {
  const { t } = useTranslation();


  return (
    <div className={`card-reserve ${className}`}>
      <div className="card-reserve__image-container">
        {image && (
          <img
            src={image}
            alt={title && t(title)}
            className="card-reserve__image"
          />
        )}
      </div>
      <div className="card-reserve__content">
        <h2 className="card-reserve__title">{title && t(title)}</h2>
        {description && (
          <p className="card-reserve__description">{t(description)}</p>
        )}
        {children}
        {buttonText && url && (
          <a
            href={url}
            className="btn--reserve"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t(buttonText)}
          </a>
        )}
      </div>
    </div>
  );
};

// 加入 PropTypes 驗證
ReserveCard.propTypes = {
  title: PropTypes.string.isRequired, // 必須是 string，且必填
  description: PropTypes.string,
  image: PropTypes.string,
  buttonText: PropTypes.string,
  url: PropTypes.string, // 替換 onReserve 為 url
  className: PropTypes.string,
  children: PropTypes.node,
};

export default ReserveCard;
