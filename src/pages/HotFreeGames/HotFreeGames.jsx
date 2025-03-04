import { useState } from "react";
import { useTranslation } from "react-i18next"; // 引入 i18n
import cardHotData from "../../components/HotFreeCard/HotFreeCardData";
import HotFreeCard from "../../components/HotFreeCard/HotFreeCard";
import "./hot-free-gmaes.scss";

const HotFreeGames = () => {
  const { t } = useTranslation(); // 使用 i18n 翻譯

  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  const allTags = [...new Set(cardHotData.flatMap((card) => card.tagKeys))];
  const allPlatforms = [...new Set(cardHotData.flatMap((card) => card.platforms))];

  const handleTagClick = (tag) => {
    setSelectedTags((prevSelected) =>
      prevSelected.includes(tag)
        ? prevSelected.filter((t) => t !== tag)
        : [...prevSelected, tag]
    );
  };

  const handlePlatformClick = (platform) => {
    setSelectedPlatforms((prevSelected) =>
      prevSelected.includes(platform)
        ? prevSelected.filter((p) => p !== platform)
        : [...prevSelected, platform]
    );
  };

  const filteredCards = cardHotData.filter((card) => {
    const matchesTags = selectedTags.length
      ? selectedTags.every((tag) => card.tagKeys.includes(tag))
      : true;

    const matchesPlatforms = selectedPlatforms.length
      ? selectedPlatforms.every((platform) => card.platforms.includes(platform))
      : true;

    return matchesTags && matchesPlatforms;
  });

  return (
    <section className="hot-container">
      <h2 className="hot-title">{t("hot.title")}</h2>

      {/* 裝置類型篩選 */}
      <div className="hot-filter">
        <h3 className="hot-filter-title">{t("hot.filter-platform")}</h3>
        <div className="hot-filter-tags">
          {allPlatforms.map((platform) => (
            <button
              key={platform}
              className={`hot-filter-tag ${
                selectedPlatforms.includes(platform) ? "active" : ""
              }`}
              onClick={() => handlePlatformClick(platform)}
            >
              {t(`platforms.${platform}`)} {/* 這裡翻譯 platform */}
            </button>
          ))}
        </div>
      </div>

      {/* 遊戲類型篩選 */}
      <div className="hot-filter">
        <h3 className="hot-filter-title">{t("hot.filter-genre")}</h3>
        <div className="hot-filter-tags">
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`hot-filter-tag ${
                selectedTags.includes(tag) ? "active" : ""
              }`}
              onClick={() => handleTagClick(tag)}
            >
              {t(`tags.${tag}`)} {/* 這裡翻譯 tag */}
            </button>
          ))}
        </div>
      </div>

      {/* 過濾後的卡片 */}
      <div className="card-grid-hot">
        {filteredCards.length > 0 ? (
          filteredCards.map((card) => (
            <HotFreeCard
              key={card.id}
              title={card.title}
              image={card.image}
              url={card.url}
              className={card.className}
              tagKeys={card.tagKeys}
              platforms={card.platforms}
            />
          ))
        ) : (
          <p className="no-results">{t("hot.no-results")}</p>
        )}
      </div>
    </section>
  );
};

export default HotFreeGames;

