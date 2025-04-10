import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser } from "@fortawesome/free-solid-svg-icons";
import "../../scss/common.scss";
import "./Member.scss";

const Member = () => {
  const { t } = useTranslation();
  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!userId) return;

    axios.get(`http://localhost:5000/users/${userId}`).then((res) => {
      setUser(res.data);
    });

    axios
      .get(`http://localhost:5000/transactions?userId=${userId}`)
      .then((res) => {
        setTransactions(res.data);
      });
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="member-container">
      {/* =====Breadcrumbs=====START */}
      <nav className="breadcrumb">
        <a href="/" className="breadcrumb-item">
          <FontAwesomeIcon icon={faHouse} className="icon" />
          {t("breadcrumb.home")}
        </a>
        <span className="breadcrumb-separator"> &gt; </span>
        <a href="/member" className="breadcrumb-item">
          {t("member.title")}
        </a>
        <span className="breadcrumb-separator"> &gt; </span>
        <span className="breadcrumb-current">{t("member.count")}</span>
      </nav>
      {/* =====Breadcrumbs=====END */}

      <h1 className="member__title">{t("member.title")}</h1>

      <div className="member-box">
        <aside className="sidebar">
          <div className="user-info">
            <div className="user-avatar">
              <FontAwesomeIcon icon={faUser} className="fa-user" />
            </div>
            <p className="username">{user.nickname}</p>
            <p className="points">
              {user.points} <span className="points__text">{t("member.points")}</span>
            </p>
          </div>
          <nav className="menu">
            <ul>
              <li className="menu-item">
                <a href="#" className="menu-item__link">
                  {t("member.menu.recharge")}
                </a>
              </li>
              <li className="menu-item active">
                <a href="#" className="menu-item__link">
                {t("member.menu.checkPoints")}
                </a>
              </li>
              <li className="menu-item">
                <a href="#" className="menu-item__link">
                {t("member.menu.customerService")}
                </a>
              </li>
              <li className="menu-item">
                <a href="#" className="menu-item__link">
                {t("member.menu.myCertificates")}
                </a>
              </li>
              <li className="menu-item">
                <a href="#" className="menu-item__link">
                {t("member.menu.changePassword")}
                </a>
              </li>
              <li className="menu-item">
                <a href="#" className="menu-item__link">
                {t("member.menu.myBookings")}
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="points-content">
          <section className="points-check">
            <h2 className="points__title">{t("member.menu.checkPoints")}</h2>
            <p className="remaining-points">
              {t("member.remainingPoints")} <span className="points-value">{user.points}</span>
            </p>

            <div className="transaction-list">
              {transactions.map((tx) => (
                <div className="transaction" key={tx.id}>
                  <div className="transaction-info">
                    <p className="time">{tx.time}</p>
                    <p className="payment-method">{tx.paymentMethod}</p>
                    <p className="order-id">
                      {t("member.orderNumber")}：<strong>{tx.orderId}</strong>
                    </p>
                  </div>
                  <p className="points-detail">
                    <span className="points-amount">{tx.points} {t("member.points")}</span>
                    {t("member.rechargeAmount")}：{tx.amount}
                    <span className={`status ${tx.status}`}>
                      {tx.status === "success"
                        ? t("member.success")
                        : tx.status === "processing"
                        ? t("member.processing")
                        : t("member.failed")}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Member;
