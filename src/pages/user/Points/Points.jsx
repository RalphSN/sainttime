import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Points.scss";

const API_URL = import.meta.env.VITE_API_URL;

const Points = () => {
  const { t } = useTranslation();
  const [user] = useOutletContext();
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/transactions?userId=${user.id}`)
      .then((res) => {
        setTransactions(res.data);
      })
      .catch((err) => {
        console.error("載入交易紀錄失敗：", err);
      });
  }, [user.id]);

  return (
    <>
      <main className="points-content">
        <section className="points-check">
          <button onClick={() => navigate(-1)} className="btn--back">
            ← {t("complaint.back")}
          </button>
          <h2 className="points__title">{t("member.menu.checkPoints")}</h2>
          <p className="remaining-points">
            {t("member.remainingPoints")}{" "}
            <span className="points-value">{user.points}</span>
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
                  <span className="points-amount">
                    {tx.points} {t("member.points")}
                  </span>
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
    </>
  );
};

export default Points;
