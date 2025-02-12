import PropTypes from "prop-types"; // 加入 PropTypes 驗證
import { useTranslation } from "react-i18next";
import "./reserve-card.scss";

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
      <div className="reserve-image-container">
        {image && (
          <img
            src={image}
            alt={title && t(title)}
            className="card-reserve-image"
          />
        )}
      </div>
      <div className="card-reserve-content">
        <h2 className="card-reserve-title">{title && t(title)}</h2>
        {description && (
          <p className="card-reserve-description">{t(description)}</p>
        )}
        {children}
        {buttonText && url && (
          <a
            href={url}
            className="card-reserve-button"
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
