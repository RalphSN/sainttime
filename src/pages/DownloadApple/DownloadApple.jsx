import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons"; 
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./DownloadApple.scss";
import cardHotData from "../../components/HotFreeCard/HotFreeCardData";

const DownloadApple = () => {
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
    <section className="ios-download-container">
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
        <a href="/game" className="breadcrumb-item">
        {t(gameData.title)}
        </a>
        <span className="breadcrumb-separator"> &gt; </span>
        <span className="breadcrumb-current">從 App Store 下載</span>
      </nav>

      {/* =====Breadcrumbs=====END */}

      <div className="page">
        <header className="title">
          <h1>{t("details.header")}</h1>
        </header>
        <section className="info">
          <div className="info-content">
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
        </section>
        <section className="ios-download">
                {/* 3/6從這裡開始繼續寫 */}
        </section>
      </div>
    </section>
  );
};

// **新增 PropTypes 驗證**
DownloadApple.propTypes = {
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

export default DownloadApple;