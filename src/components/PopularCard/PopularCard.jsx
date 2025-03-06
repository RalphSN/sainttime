import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./popular-card.scss";

const PopularCard = ({
  id,
  title,
  image,
  buttonText,
  className = "",
  children,
}) => {
  const { t } = useTranslation();

  return (
    <div className={`card-popular ${className}`}>
      {image && (
        <img src={image} alt={t(title)} className="card-popular-image" />
      )}
      <div className="card-popular-content">
        <h2 className="card-popular-title">{t(title)}</h2>
        {children}
        {buttonText && id && (
          <Link to={`/game?id=${id}`} className="card-popular-button">
            {t(buttonText)}
          </Link>
        )}
      </div>
    </div>
  );
};

//  加入 PropTypes 驗證
PopularCard.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
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
