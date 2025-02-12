import PropTypes from "prop-types"; // 加入 PropTypes 驗證
import { useTranslation } from "react-i18next";
import "./popular-card.scss";

const PopularCard = ({
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
    <div className={`card-popular ${className}`}>
      {image && <img src={image} alt={t(title)} className="card-popular-image" />}
      <div className="card-popular-content">
        <h2 className="card-popular-title">{t(title)}</h2>
        {description && (
          <p className="card-popular-description">{t(description)}</p>
        )}
        {children}
        {buttonText && url && (
          <a
            href={url}
            className="card-popular-button"
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

//  加入 PropTypes 驗證
PopularCard.propTypes = {
  title: PropTypes.string.isRequired, // 必須是 string，且必填
  description: PropTypes.string,
  image: PropTypes.string,
  buttonText: PropTypes.string,
  url: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default PopularCard;

//API DEMO
// const [cardData, setCardData] = React.useState([]);
// React.useEffect(() => {
//   fetch("https://example.com/api/cards")
//     .then((response) => response.json())
//     .then((data) => setCardData(data));
// }, []);
