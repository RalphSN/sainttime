import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import "./GiftPackPage.scss";
import "../../scss/common.scss";

const API_URL = import.meta.env.VITE_API_URL;

const GiftPackPage = () => {
  const [giftPacks, setGiftPacks] = useState([]);
  const [claimedPacks, setClaimedPacks] = useState([]);
  const userId = localStorage.getItem("userId"); // 假設已登入後會有 userId
  const { t } = useTranslation();

  useEffect(() => {
    fetch(`${API_URL}/giftPacks`)
      .then((res) => res.json())
      .then(setGiftPacks);

    fetch(`${API_URL}/claims?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setClaimedPacks(data.map((d) => d.giftPackId)));
  }, [userId]);

  const handleClaim = async (giftPackId) => {
    if (!userId) return alert("請先登入！");

    const alreadyClaimed = claimedPacks.includes(giftPackId);
    if (alreadyClaimed) return;

    await fetch(`${API_URL}/claims`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, giftPackId, claimedAt: new Date() }),
    });

    setClaimedPacks([...claimedPacks, giftPackId]);
  };

  return (
    <div className="gift-page">
      {/* =====Breadcrumbs=====START */}
      <nav className="breadcrumb">
        <a href="/" className="breadcrumb-item">
          <FontAwesomeIcon icon={faHouse} className="icon" />
          {t("breadcrumb.home")}
        </a>
        <span className="breadcrumb-separator"> &gt; </span>
        <span className="breadcrumb-current">{t("gift.title")}</span>
      </nav>

      {/* =====Breadcrumbs=====END */}

      <h1 className="gift__title">{t("gift.title")}</h1>
      {giftPacks.map((pack) => {
        const expired = new Date() > new Date(pack.endDate);
        const claimed = claimedPacks.includes(pack.id);

        return (
          <div className="gift-item" key={pack.id}>
            <div className="gift-item__content">
              <figure className="gift-item__avatar">
                <img src={pack.image} alt="icon" className="avatar" />
              </figure>
              <div className="gift-item__info">
                <h2>{pack.title}</h2>
                <p>{pack.content}</p>
                <p>
                  有效期限：{pack.startDate} ~ {pack.endDate}
                </p>
              </div>
            </div>
            <div className="btn-box">
              <button
                disabled={expired || claimed}
                onClick={() => handleClaim(pack.id)}
                className="btn--withdraw"
              >
                {expired ? "已過期" : claimed ? "已領取" : "領取"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GiftPackPage;
