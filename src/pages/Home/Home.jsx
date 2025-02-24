import { useTranslation } from "react-i18next";
import "./home.scss";
import cardData from "../../components/PopularCard/CardPopularData";
import reserveCardData from "../../components/ReserveCard/CardReserveCard";
import PopularCard from "../../components/PopularCard/PopularCard";
import ReserveCard from "../../components/ReserveCard/ReserveCard";

const Home = () => {
  const { t } = useTranslation();

  return (
    <main>
      <div className="home-container">
        <div className="home-carousel">
          <img
            src="https://cdn.jsdelivr.net/gh/RalphSN/images@main/sainttime-images/sainttime-banner.gif"
            alt=""
          />
        </div>
        <div className="home-content">
          <div className="home-popular">
            <h2 className="home-popular-title">{t("home.popularGames")}</h2>
            <div className="card-grid-popular">
              {cardData.map((card) => (
                <PopularCard
                  key={card.id}
                  title={card.title}
                  description={card.description}
                  image={card.image}
                  buttonText={card.buttonText}
                  url={card.url}
                  className={card.className}
                />
              ))}
            </div>
            <div className="more-btn-box">
              <button className="more">{t("home.more")}</button>
            </div>
          </div>
          <div className="home-side">
            <div className="home-side-reserve">
              <h2 className="home-side-reserve-title">{t("home.reserve")}</h2>
              <div className="reserve-game-list">
                {reserveCardData.map((game) => (
                  <ReserveCard
                    key={game.id}
                    title={game.title}
                    description={game.description}
                    image={game.image}
                    buttonText={game.buttonText}
                    url={game.url}
                  />
                ))}
              </div>
            </div>
            <div className="home-side-ad">
              <a href="#" className="home-side-ad-link">
                <img
                  src="https://cdn.jsdelivr.net/gh/RalphSN/images@main/sainttime-images/image-ad.gif"
                  alt=""
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
