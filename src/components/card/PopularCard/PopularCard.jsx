import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./PopularCard.scss";
import "../../../scss/common.scss"

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
      <figure className="card-popular__image-container">
        {image ? (
          <img
            src={image}
            alt={t(title)}
            className="card-popular__image"
            loading="lazy"
          />
        ) : (
          <div className="card-popular__image skeleton" />
        )}
      </figure>
      <div className="card-popular__content">
        <p className="card-popular__title">{t(title)}</p>
        {children}
        {buttonText && id && (
          <Link to={`/game?id=${id}`} className="btn--play">
            {t(buttonText)}
          </Link>
        )}
      </div>
    </div>
  );
};

PopularCard.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  image: PropTypes.string,
  buttonText: PropTypes.string,
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
