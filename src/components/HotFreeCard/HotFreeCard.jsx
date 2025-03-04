import PropTypes from "prop-types"; 
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./hot-free-card.scss";

const HotFreeCard = ({
  id, // 對應id屬性
  title,
  image,
  className = "",
  children,
  tagKeys = [],
  platforms = []
}) => {
  const { t } = useTranslation();

  return (
    <Link
      className={`card-hot ${className}`}
      to={`/game?id=${id}`} 
      data-platforms={platforms.join(",")}
    >
      <figure className="card-hot-image-container">
        {image && <img src={image} alt={t(title)} className="card-hot-image" />}
      </figure>
      <div className="card-hot-content">
        <h2 className="card-hot-title">{t(title)}</h2>
        {children}
        <div className="card-tags">
          {tagKeys.map((key, index) => (
            <span key={index} className="tag">
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
  id: PropTypes.string.isRequired, // 新增 id，且必須是 string
  title: PropTypes.string.isRequired, // 必須是 string，且必填
  tagKeys: PropTypes.arrayOf(PropTypes.string),
  platforms: PropTypes.arrayOf(PropTypes.string),
  image: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default HotFreeCard;
