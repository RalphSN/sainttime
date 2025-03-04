import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./game-details.scss";

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

// **模擬遊戲資料**
const mockGamesData = [
  {
    id: "1",
    name: "火影：淫忍考試",
    version: "1.0",
    tags: ["動作冒險", "多人競技", "Android", "iOS"],
    description:
      "神秘少年意外穿越到了火影的世界，並加入了火影村。在這裡，你與眾多火影女英雄並肩作戰，共同保衛家園。你們面對的是威脅村莊和世界和平的強大勢力。在這個過程中，你不斷成長，成為了一名真正的忍者。",
    avatar: baseUrl + "ninja-avatar.png",
  },
  {
    id: "5",
    name: "火影:女巫現身",
    version: "2.0",
    tags: ["科幻", "動作", "單人", "PC"],
    description:
      "神秘女巫意外穿越到了火影的世界，並加入了火影村。在這裡，你與眾多火影女英雄並肩作戰，共同保衛家園。你們面對的是威脅村莊和世界和平的強大勢力。在這個過程中，你不斷成長，成為了一名真正的忍者。",
    avatar: baseUrl + "witch-avatar.png",
  },
];

const GameDetails = () => {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get("id");

  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    // 模擬 API 獲取數據
    const game = mockGamesData.find((g) => g.id === gameId);
    setGameData(game);
  }, [gameId]);

  if (!gameData) {
    return <h2>遊戲未找到</h2>;
  }

  return (
    <section className="game-details-container">
      <div className="game-page">
        <header className="game-title">
          <h1>熱門免費遊戲</h1>
        </header>
        <section className="game-info">
          <div className="game-info-content">
            <img
              src={gameData.avatar}
              alt="game-avatar"
              className="game-avatar"
            />
            <div className="info-text-container">
              <h2>{gameData.name}</h2>
              <p>版本號：{gameData.version}</p>
              <p className="info-text">{gameData.description}</p>
              <div className="tags">
                {gameData.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="download-buttons">
            <button className="ios">iOS 下載</button>
            <button className="android">Android 下載</button>
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
        <section className="game-description">
          <h2>遊戲介紹</h2>
          <p>{gameData.description}</p>
        </section>
      </div>
    </section>
  );
};

export default GameDetails;
