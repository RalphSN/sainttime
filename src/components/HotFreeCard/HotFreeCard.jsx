import PropTypes from "prop-types"; // 加入 PropTypes 驗證
import { useTranslation } from "react-i18next";
import "./hot-free-card.scss";

const HotFreeCard = ({
  title,
  image,
  url,
  className = "",
  children,
  tagKeys = [],
  platforms = []
}) => {
  const { t } = useTranslation();

  return (
    <a
      className={`card-hot ${className}`}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      data-platforms={platforms.join(",")}
    >
      <figure className="card-hot-image-container">{image && <img src={image} alt={t(title)} className="card-hot-image" />}</figure>
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
    </a>
  );
};

//  加入 PropTypes 驗證
HotFreeCard.propTypes = {
  title: PropTypes.string.isRequired, // 必須是 string，且必填
  tagKeys: PropTypes.arrayOf(PropTypes.string),
  platforms: PropTypes.arrayOf(PropTypes.string),
  image: PropTypes.string,
  url: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default HotFreeCard;
