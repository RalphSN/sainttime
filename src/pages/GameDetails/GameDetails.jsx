import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faAndroid } from "@fortawesome/free-brands-svg-icons";
import { faHouse } from "@fortawesome/free-solid-svg-icons"; 
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./game-details.scss";
import cardHotData from "../../components/HotFreeCard/HotFreeCardData";

const baseUrl =
  "https://cdn.jsdelivr.net/gh/RalphSN/images@main/sainttime-images/game-images/";
const imageNames = [
  "image1.png",
  "image2.png",
  "image3.png",
  "image4.png",
  "image5.png",
];
const images = imageNames.map((name) => baseUrl + name);

const GameDetails = () => {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get("id");
  const [gameData, setGameData] = useState(null);
  const { t } = useTranslation(); // 使用 i18n 翻譯

  useEffect(() => {
    if (Array.isArray(cardHotData) && cardHotData.length > 0) {
      // 確保 cardHotData 有值
      const game = cardHotData.find((g) => g.id.toString() === gameId);
      setGameData(game);
    }
  }, [gameId]);

  if (!gameData) {
    return <h2>{t("details.notFound")}</h2>;
  }

  return (
    <section className="game-details-container">
      {/* =====Breadcrumbs=====START */}
      <nav className="breadcrumb">
        <a href="/" className="breadcrumb-item">
        <FontAwesomeIcon icon={faHouse} className="icon" />
          {t("breadcrumb.home")}
        </a>
        <span className="breadcrumb-separator"> &gt; </span>
        <a href="/hot-free-games" className="breadcrumb-item">
          {t("breadcrumb.hotFreeGames")}
        </a>
        <span className="breadcrumb-separator"> &gt; </span>
        <span className="breadcrumb-current">{t(gameData.title)}</span>
      </nav>

      {/* =====Breadcrumbs=====END */}

      <div className="game-page">
        <header className="game-title">
          <h1>{t("details.header")}</h1>
        </header>
        <section className="game-info">
          <div className="game-info-content">
            <img
              src={gameData.avatar}
              alt="game-avatar"
              className="game-avatar"
            />
            <div className="info-text-container">
              <h2>{t(gameData.title)}</h2>
              <p>
                {t("details.version")}：{gameData.version || "unknown"}
              </p>
              <p className="info-text">{t(gameData.description)}</p>
              <div className="tags">
                {gameData.tagKeys.map((tag, index) => (
                  <span key={index} className="tag tag-tag">
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
              <button className="ios download-btn">
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
            {images.map((img, index) => (
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
        <section className="game-introduce-container">
          <h2 className="game-introduce-title">{t("details.introduction")}</h2>
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
  cardHotData: PropTypes.arrayOf(
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
