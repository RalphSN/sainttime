import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../components/common/Loading/Loading";
import "../../../scss/common.scss";
import "./NewsPage.scss";

const NewsPage = () => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const currentLang = i18n.language || "zh-TW";

  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemsPerPage = 10; // 每頁顯示的新聞數量

  // 優化 fetchNews，避免多次請求
  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 首先，獲取總數量
      const totalNewsResponse = await fetch(
        `https://m1.apifoxmock.com/m1/5506995-5183228-default/news?page=${currentPage}&limit=${itemsPerPage}`
      );

      if (!totalNewsResponse.ok) {
        throw new Error("cannot fetch news");
      }

      const allNews = await totalNewsResponse.json();

      setTotalPages(
        allNews.total ? Math.ceil(allNews.total / itemsPerPage) : 1
      );

      setNews(allNews.news || []);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "try again later");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // 格式化日期 (使用 Intl.DateTimeFormat)
  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(dateString));
  };

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 1) {
      setCurrentPage(1);
    }
  }, [totalPages]);

  if (loading) return <Loading justifyContent="center" />;

  return (
    <div className="news">
      {/* =====Breadcrumbs=====START */}
      <nav className="breadcrumb">
        <a href="/" className="breadcrumb-item">
          <FontAwesomeIcon icon={faHouse} className="icon" />
          {t("breadcrumb.home")}
        </a>
        <span className="breadcrumb-separator"> &gt; </span>
        <span className="breadcrumb-current">{t("news.title")}</span>
      </nav>

      {/* =====Breadcrumbs=====END */}

      <h1 className="news__title">{t("news.title")}</h1>

      {error ? (
        <div className="error-message">
          <p>
            {t("news.error")}: {error}
          </p>
          <button onClick={fetchNews}>{t("news.tryAgain")}</button>
        </div>
      ) : (
        <>
          <div className="news-list">
            {news.length > 0 ? (
              news.map((item) => (
                <Link
                  key={item.id}
                  to={`/news/${item.id}`}
                  className="news-item"
                >
                  <div className="news-info">
                    <figure className="news-thumbnail">
                      <img
                        src={item.thumbnail}
                        alt={item.title[currentLang]}
                        className="news-thumbnail__img"
                      />
                    </figure>
                    <span className="news-category">
                      【 {item.category[currentLang]} 】
                    </span>
                    <h2 className="news-item__title">
                      {item.title[currentLang]}
                    </h2>
                  </div>
                  <div className="news-date">{formatDate(item.date)}</div>
                </Link>
              ))
            ) : (
              <div className="no-news">{t("news.noNews")}</div>
            )}
          </div>

          {/* 分頁區塊 */}
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="btn--page btn--extrem"
            >
              {t("pagination.firstPage")}
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn--page"
            >
              {t("pagination.prevPage")}
            </button>

            <div className="page-select">
              <span className="page-select__text">{t("pagination.the")}</span>
              <select
                value={currentPage > totalPages ? 1 : currentPage} // 確保 currentPage 不超過 totalPages
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="page-select__select"
              >
                {Array.from({ length: totalPages }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <span className="page-select__text">
                {t("pagination.page")} / {t("pagination.total")} {totalPages}{" "}
                {t("pagination.page")}
              </span>
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="btn--page"
            >
              {t("pagination.nextPage")}
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="btn--page btn--extrem"
            >
              {t("pagination.lastPage")}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NewsPage;
