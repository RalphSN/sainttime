import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faAndroid } from "@fortawesome/free-brands-svg-icons";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import NotFound from "../../components/NotFound/NotFound";
import cardData from "../../data/cardData";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../scss/common.scss";
import "./GameDetails.scss";

const GameDetails = () => {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get("id");
  const [gameData, setGameData] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (Array.isArray(cardData) && cardData.length > 0) {
      const game = cardData.find((g) => g.id.toString() === gameId);
      setGameData(game);
    }
  }, [gameId]);

  if (!gameData) {
    return (
      <NotFound
        message={t("notFound.message")}
        height={"calc(100vh - 21rem)"}
      />
    );
  }

  return (
    <section className="game-details">
      {/* =====Breadcrumbs=====START */}
      <nav className="breadcrumb">
        <a href="/" className="breadcrumb-item">
          <FontAwesomeIcon icon={faHouse} className="icon" />
          {t("breadcrumb.home")}
        </a>
        <span className="breadcrumb-separator"> &gt; </span>
        <a href="/games" className="breadcrumb-item">
          {t("breadcrumb.hotFreeGames")}
        </a>
        <span className="breadcrumb-separator"> &gt; </span>
        <span className="breadcrumb-current">{t(gameData.title)}</span>
      </nav>

      {/* =====Breadcrumbs=====END */}

      <div className="game__page">
        <header className="game__title">
          <h1 className="game__title-text">{t("details.header")}</h1>
        </header>
        <section className="game__info">
          <div className="game__info-content">
            <img
              src={gameData.avatar}
              alt="game-avatar"
              className="game-avatar"
            />
            <div className="info-text__container">
              <h2>{t(gameData.title)}</h2>
              <p>
                {t("details.version")}：{gameData.version || "unknown"}
              </p>
              <p className="info-text">{t(gameData.description)}</p>
              <div className="tags">
                {gameData.tagKeys.map((tag, index) => (
                  <span key={index} className="tag tag-genre">
                    {t(`tags.${tag}`)}
                  </span>
                ))}
                {gameData.language.map((language, index) => (
                  <span key={index} className="tag tag-language">
                    {language}
                  </span>
                ))}
                {gameData.platforms.map((platforms, index) => (
                  <span key={index} className="tag tag-platforms">
                    {t(`platforms.${platforms}`)}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="download-buttons">
            {gameData.platforms.includes("ios") && (
              <button
                className="ios download-btn"
                onClick={() => navigate(`/gameiOS?id=${gameId}`)}
              >
                <FontAwesomeIcon icon={faApple} className="icon" /> iOS
              </button>
            )}
            {gameData.platforms.includes("android") && (
              <button className="android download-btn">
                <FontAwesomeIcon icon={faAndroid} className="icon" /> Android
              </button>
            )}
          </div>
        </section>
        <section className="carousel">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            loop
            className="carousel-container"
          >
            {gameData.carouselImages.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img}
                  alt={`slide-${index}`}
                  className="carousel-image"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
        <section className="game-introduce__container">
          <h2 className="game-introduce__title">{t("details.introduction")}</h2>
          <p
            className="game-introduce"
            dangerouslySetInnerHTML={{
              __html: t(gameData.introduce)
                ? t(gameData.introduce).replace(/(\d+\.)/g, "<br />$1")
                : t("game.noDetails"),
            }}
          />
        </section>
      </div>
    </section>
  );
};

// **新增 PropTypes 驗證**
GameDetails.propTypes = {
  cardData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      tagKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
      url: PropTypes.string.isRequired,
      platforms: PropTypes.arrayOf(PropTypes.string).isRequired,
      avatar: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      introduce: PropTypes.string,
    })
  ),
};

export default GameDetails;
