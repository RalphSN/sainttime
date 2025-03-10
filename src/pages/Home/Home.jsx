import { useTranslation } from "react-i18next";
import "./Home.scss";
import cardData from "../../components/PopularCard/CardPopularData";
import reserveCardData from "../../components/ReserveCard/CardReserveCard";
import PopularCard from "../../components/PopularCard/PopularCard";
import ReserveCard from "../../components/ReserveCard/ReserveCard";

const Home = () => {
  const { t } = useTranslation();

  return (
    <main>
      <div className="home">
        <div className="home__carousel">
          <img
            src="https://cdn.jsdelivr.net/gh/RalphSN/images@main/sainttime-images/sainttime-banner.gif"
            alt=""
          />
        </div>
        <div className="home__content">
          <div className="home__popular">
            <h2 className="home__popular-title">{t("home.popularGames")}</h2>
            <div className="home__popular-grid">
              {cardData.map((card) => (
                <PopularCard
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  image={card.image}
                  buttonText={card.buttonText}
                  className={card.className}
                />
              ))}
            </div>
            <div className="more-btn-box">
              <button className="btn-more">{t("home.more")}</button>
            </div>
          </div>
          <div className="home__side">
            <div className="home__side-reserve">
              <h2 className="home__side-reserve-title">{t("home.reserve")}</h2>
              <div className="home__reserve-list">
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
            <div className="home__side-ad">
              <a href="#" className="home__side-ad-link">
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
