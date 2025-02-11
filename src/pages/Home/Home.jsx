import { useTranslation } from "react-i18next";
import "./home.scss";

const Home = () => {
  const { t } = useTranslation();

  return (
    <main>
      <div className="home-container">
        <div className="home-carousel">
          <img src="https://cdn.jsdelivr.net/gh/RalphSN/images@main/sainttime-images/sainttime-banner.gif" alt="" />
        </div>
        <div className="home-content">
          <div className="home-popular">
            <h2 className="home-popular-title">{t("home.popularGames")}</h2>
            <button className="more">{t("home.more")}</button>
          </div>
          <div className="home-side">
            <div className="home-side-reserve">
              <h2 className="home-side-reserve-title">{t("home.reserve")}</h2>
            </div>
            <div className="home-side-ad"></div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;