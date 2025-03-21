import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Loading from "../../components/Loading/Loading";
import "./NewsDetail.scss";

const NewsDetail = () => {
  const { id } = useParams();
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language || "zh-TW";

  const [newsDetail, setNewsDetail] = useState({ images: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNewsDetail = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://m1.apifoxmock.com/m1/5506995-5183228-default/news?page=1&limit=10`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.news || data.news.length === 0) {
        throw new Error("No news data found");
      }

      const foundNews = data.news.find(
        (item) => String(item.id) === String(id)
      );

      if (!foundNews) {
        throw new Error("News not found");
      }

      setNewsDetail({
        ...foundNews,
        images: Array.isArray(foundNews.images) ? foundNews.images : [],
      });
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchNewsDetail();
  }, [fetchNewsDetail]);

  // ===== ImageSlider START =====
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // 更新按鈕狀態
  const updateScrollButtons = () => {
    setTimeout(() => {
      // 延遲執行，確保滾動動畫完成後才更新按鈕狀態
      if (!sliderRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;

      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }, 100);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || !newsDetail) return;

    let isMouseDown = false;
    let startX = 0;
    let scrollLeft = 0;

    // 滑鼠/觸控開始拖動
    const handleStart = (e) => {
      isMouseDown = true;
      startX = e.type.includes("touch")
        ? e.touches[0].pageX - slider.offsetLeft
        : e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      slider.style.cursor = "grabbing";
      e.preventDefault();
    };

    // 滑鼠/觸控移動
    const handleMove = (e) => {
      if (!isMouseDown) return;
      const x = e.type.includes("touch")
        ? e.touches[0].pageX - slider.offsetLeft
        : e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // 控制滑動速度
      slider.scrollLeft = scrollLeft - walk;
      updateScrollButtons(); // 更新按鈕狀態
      e.preventDefault();
    };

    // 滑鼠/觸控結束拖動
    const handleEnd = () => {
      isMouseDown = false;
      slider.style.cursor = "grab";
    };

    // 修正滑鼠滾輪水平滾動
    const handleWheel = (e) => {
      if (!sliderRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;

      if (scrollWidth > clientWidth) {
        e.preventDefault(); // 只有當 `image-slider` 需要水平滾動時才阻止預設滾動
        const scrollAmount = Math.sign(e.deltaY) * clientWidth * 0.3;
        sliderRef.current.scrollLeft = Math.min(
          Math.max(scrollLeft + scrollAmount, 0),
          scrollWidth - clientWidth
        );

        setTimeout(updateScrollButtons, 100);
      }
    };

    // 綁定事件
    slider.addEventListener("mousedown", handleStart);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    slider.addEventListener("touchstart", handleStart, { passive: false });
    slider.addEventListener("touchmove", handleMove, { passive: false });
    slider.addEventListener("touchend", handleEnd);
    slider.addEventListener("wheel", handleWheel, { passive: false });

    // 監聽滾動事件，更新按鈕狀態
    slider.addEventListener("scroll", updateScrollButtons);
    updateScrollButtons(); // 初次加載時檢查狀態

    return () => {
      slider.removeEventListener("mousedown", handleStart);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      slider.removeEventListener("touchstart", handleStart);
      slider.removeEventListener("touchmove", handleMove);
      slider.removeEventListener("touchend", handleEnd);
      slider.removeEventListener("wheel", handleWheel);
      slider.removeEventListener("scroll", updateScrollButtons);
    };
  }, [newsDetail]);

  // ===== ImageSlider END =====

  if (loading) return <Loading justifyContent="center"/>;
  if (error)
    return (
      <div className="error">
        {t("news.error")}: {error}
      </div>
    );
  if (!newsDetail) return <div className="no-news">{t("news.noNews")}</div>;

  return (
    <div className="news-detail">
      {/* ===== Breadcrumbs START ===== */}
      <nav className="breadcrumb">
        <Link to="/" className="breadcrumb-item">
          <FontAwesomeIcon icon={faHouse} className="icon" />
          {t("breadcrumb.home")}
        </Link>
        <span className="breadcrumb-separator"> &gt; </span>
        <Link to="/news" className="breadcrumb-item">
          {t("news.title")}
        </Link>
        <span className="breadcrumb-separator"> &gt; </span>
        <span className="breadcrumb-current">
          {newsDetail.title[currentLang]}
        </span>
      </nav>
      {/* ===== Breadcrumbs END ===== */}

      <h1 className="news-detail__title">{newsDetail.title[currentLang]}</h1>
      <div className="news-meta">
        <span className="news-category">
          【{newsDetail.category[currentLang]}】
        </span>
        <span className="news-date">
          {new Intl.DateTimeFormat("zh-TW", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(new Date(newsDetail.date))}
        </span>
      </div>
      <figure className="news-thumbnail">
        <div className="image-slider-container">
          <div
            className={`image-slider ${
              newsDetail?.images?.length === 1
                ? "single-image"
                : newsDetail?.images?.length === 2
                ? "double-image"
                : "multi-image"
            }`}
            ref={sliderRef}
          >
            {newsDetail?.images?.length > 0 ? (
              newsDetail.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={newsDetail.title[currentLang]}
                  className="news-thumbnail__img"
                  style={{
                    maxWidth:
                      newsDetail.images.length === 1
                        ? "100%"
                        : newsDetail.images.length === 2
                        ? "48%"
                        : "45%",
                  }}
                  draggable="false"
                />
              ))
            ) : (
              <p>No images available</p>
            )}
            {newsDetail.images.length > 2 && (
              <>
                <button
                  className="slider-btn slider-btn--right"
                  onClick={() => {
                    if (!sliderRef.current) return;

                    const { scrollLeft, scrollWidth, clientWidth } =
                      sliderRef.current;

                    // 讓滾動距離與 slider 寬度相關，每次滾動 30% 可視區域
                    const scrollAmount = clientWidth * 0.3;

                    // 設定新的 scrollLeft，確保不超過右邊界
                    sliderRef.current.scrollLeft = Math.min(
                      Math.max(scrollLeft + scrollAmount, 0),
                      scrollWidth - clientWidth
                    );

                    setTimeout(updateScrollButtons, 100);
                  }}
                  disabled={!canScrollRight}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>

                <button
                  className="slider-btn slider-btn--left"
                  onClick={() => {
                    if (!sliderRef.current) return;

                    const { scrollLeft, clientWidth } = sliderRef.current;

                    // 每次滾動 30% 可視區域
                    const scrollAmount = clientWidth * 0.3;

                    sliderRef.current.scrollLeft = Math.max(
                      scrollLeft - scrollAmount,
                      0
                    );

                    setTimeout(updateScrollButtons, 100);
                  }}
                  disabled={!canScrollLeft}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
              </>
            )}
          </div>
        </div>
      </figure>

      <div className="news-content">
        <p>{newsDetail.content[currentLang]}</p>
      </div>

      <Link to="/news" className="btn--back">
        {t("news.backToList")}
      </Link>
    </div>
  );
};

export default NewsDetail;
