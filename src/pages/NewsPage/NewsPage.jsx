import { useState, useEffect, useCallback, useRef } from "react";
import "./NewsPage.scss";

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemsPerPage = 5; // 每頁顯示的新聞數量

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
        throw new Error("無法獲取新聞總數");
      }

      const allNews = await totalNewsResponse.json();

      setTotalPages(
        allNews.total ? Math.ceil(allNews.total / itemsPerPage) : 1
      );

      setNews(allNews.news || []);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "發生未知錯誤，請稍後再試。");
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

  return (
    <div className="news-page">
      <h1>最新消息</h1>

      {error ? (
        <div className="error-message">
          <p>錯誤: {error}</p>
          <button onClick={fetchNews}>重試</button>
        </div>
      ) : loading ? (
        <div className="loading">載入中...</div>
      ) : (
        <>
          <div className="news-list">
            {news.length > 0 ? (
              news.map((item) => (
                <div key={item.id} className="news-item">
                  <h2>{item.title}</h2>
                  <div className="news-date">{formatDate(item.date)}</div>
                  <div className="news-content">{item.content}</div>
                </div>
              ))
            ) : (
              <div className="no-news">沒有找到新聞</div>
            )}
          </div>

          {/* 分頁 UI */}
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              第一頁
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              上一頁
            </button>

            <div className="page-select">
              <span>第</span>
              <select
                value={currentPage > totalPages ? 1 : currentPage} // 確保 currentPage 不超過 totalPages
                onChange={(e) => setCurrentPage(Number(e.target.value))}
              >
                {Array.from({ length: totalPages }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <span>頁 / 共 {totalPages} 頁</span>
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              下一頁
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              最後一頁
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NewsPage;
