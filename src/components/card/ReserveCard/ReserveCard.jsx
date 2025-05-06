import PropTypes from "prop-types"; 
import { useTranslation } from "react-i18next";
import "./ReserveCard.scss";
import "../../../scss/common.scss";

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
      <figure className="card-reserve__image-container">
        {image ? (
          <img
            src={image}
            alt={title && t(title)}
            className="card-reserve__image"
            loading="lazy"
          />
        ) : (
          <div className="card-reserve__image skeleton" />
        )}
      </figure>

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

ReserveCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.string,
  buttonText: PropTypes.string,
  url: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default ReserveCard;
