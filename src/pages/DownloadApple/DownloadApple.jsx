import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // 箭頭圖示
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./DownloadApple.scss";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import cardHotData from "../../components/HotFreeCard/HotFreeCardData";

const DownloadApple = () => {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get("id");
  const [gameData, setGameData] = useState(null);
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(null);
  const faqListRef = useRef(null);

  useEffect(() => {
    if (Array.isArray(cardHotData) && cardHotData.length > 0) {
      // 確保 cardHotData 有值
      const game = cardHotData.find((g) => g.id.toString() === gameId);
      setGameData(game);
    }
  }, [gameId]);

  // 生成 FAQ 列表
  const faqs = Array.from({ length: 7 }, (_, i) => ({
    question: t(`iosDownload.questions.question${i + 1}`),
    answer: t(`iosDownload.questions.answer${i + 1}`),
  }));

  // 點擊外部關閉 FAQ
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (faqListRef.current && !faqListRef.current.contains(event.target)) {
        setActiveIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // 使用 mousedown 避免點擊按鈕時觸發
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          <h1 className="title__text">{t("details.header")}</h1>
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
          <div className="download">
            <h2 className="ios-title">{t("iosDownload.download.title")}</h2>
            <h3 className="ios-subtitle">
              {t("iosDownload.download.subtitle")}
            </h3>
            <p className="ios-content">{t("iosDownload.download.content")}</p>
            <a
              href="https://d2g2eaa4illb8n.cloudfront.net/sbw6mjvgceliol"
              className="ios-btn"
            >
              {t("iosDownload.download.btn")}
            </a>
          </div>
          <div className="ipa">
            <h2 className="ios-title">{t("iosDownload.ipa.title")}</h2>
            <h3 className="ios-subtitle">{t("iosDownload.ipa.subtitle")}</h3>
            <p className="ios-content">{t("iosDownload.ipa.content1")}</p>
            <p className="ios-content">{t("iosDownload.ipa.content2")}</p>
            <a
              href="https://de1s72dat8n04.cloudfront.net/sbw6mjvgceliol"
              className="ios-btn"
            >
              {t("iosDownload.ipa.btn")}
            </a>
          </div>
          <div className="steps">
            <h2 className="ios-title">{t("iosDownload.steps.title")}</h2>
            <p className="ios-content">{t("iosDownload.steps.content1")}</p>
            <p className="ios-content">
              {t("iosDownload.steps.content2")}
              <a href="https://sideloadly.io/#download" className="steps-link">
                {t("iosDownload.steps.btn")}
              </a>
            </p>
            <p className="ios-content">{t("iosDownload.steps.content3")}</p>
            <VideoPlayer src={"/video/steps-video.mp4"} />
          </div>
          <div className="questions">
            <h2 className="ios-title">{t("iosDownload.questions.title")}</h2>
            <p className="ios-content">{t("iosDownload.questions.content")}</p>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={activeIndex === index}
                  onClick={() =>
                    setActiveIndex(activeIndex === index ? null : index)
                  }
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

// FAQ 展開/收起子組件
// FAQ 組件
const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`}>
      <button className="faq-question" onClick={onClick}>
        {question}
        <span>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
      </button>
      <div
        className="faq-answer-container"
        style={{ maxHeight: isOpen ? "200px" : "0" }}
      >
        <div className="faq-answer">{answer}</div>
      </div>
    </div>
  );
};

// ** PropTypes 驗證**
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
FAQItem.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default DownloadApple;
