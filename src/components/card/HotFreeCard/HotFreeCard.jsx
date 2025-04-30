import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./HotFreeCard.scss";

const HotFreeCard = ({
  id, // 對應id屬性
  title,
  image,
  className = "",
  children,
  tagKeys = [],
  platforms = [],
}) => {
  const { t } = useTranslation();

  return (
    <Link
      className={`card-hot ${className}`}
      to={`/game?id=${id}`}
      data-platforms={platforms.join(",")}
    >
      <figure className="card-hot__image-container">
        {image && (
          <img src={image} alt={t(title)} className="card-hot__image" />
        )}
      </figure>
      <div className="card-hot__content">
        <h2 className="card-hot__title">{t(title)}</h2>
        {children}
        <div className="card-hot__tags">
          {tagKeys.map((key, index) => (
            <span key={index} className="card-hot__tag">
              {t(`tags.${key}`)}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

//  加入 PropTypes 驗證
HotFreeCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  tagKeys: PropTypes.arrayOf(PropTypes.string),
  platforms: PropTypes.arrayOf(PropTypes.string),
  image: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default HotFreeCard;
