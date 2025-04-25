import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAlipay,
  faWeixin,
  faApplePay,
  faGooglePay,
} from "@fortawesome/free-brands-svg-icons";
import { faCreditCard as faCreditCardTThin } from "@fortawesome/free-regular-svg-icons";
import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import RechargeConfirmationModal from "../../../components/modal/RechargeModal/RechargeConfirmationModal";
import RechargeSuccessModal from "../../../components/modal/RechargeModal/RechargeSuccessModal";
import "./Recharge.scss";

// 讀取環境變數
const API_URL = import.meta.env.VITE_API_URL;

const Recharge = () => {
  const { t } = useTranslation();
  const [user] = useOutletContext();
  const navigate = useNavigate();
  const [methods, setMethods] = useState([]);
  const [currency, setCurrency] = useState("CNY");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amounts, setAmounts] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    setSelectedMethod(null);
    setSelectedAmount(null);
    axios.get(`${API_URL}/paymentMethods?currency=${currency}`).then((res) => {
      setMethods(res.data);
    });
  }, [currency]);

  useEffect(() => {
    setSelectedAmount(null);
    if (selectedMethod) {
      axios
        .get(
          `${API_URL}/paymentAmounts?currency=${currency}&methodId=${selectedMethod}`
        )
        .then((res) => {
          if (res.data.length > 0) {
            setAmounts(res.data[0].amounts);
          }
        });
    }
  }, [selectedMethod, currency]);

  const iconMap = {
    alipay: faAlipay,
    wechat: faWeixin,
    applepay: faApplePay,
    googlepay: faGooglePay,
    creditcard: faCreditCardTThin,
    atm: faSackDollar,
  };

  const getPointValue = (amount) => amount * 100;

  return (
    <>
      <main className="recharge-content">
        <section className="recharge-check">
          <button onClick={() => navigate(-1)} className="btn--back">
            ← {t("complaint.back")}
          </button>
          <h2 className="recharge__title">{t("member.menu.recharge")}</h2>
          <p className="recharge__hint">
            {t("recharge.hint1")}《<a>{t("recharge.contact")}</a>》
            {t("recharge.hint2")}
          </p>
          <div className="payment-methods">
            <div className="currency-tabs">
              {["CNY", "TWD"].map((cur) => (
                <button
                  key={cur}
                  className={
                    currency === cur ? "btn--currency active" : "btn--currency"
                  }
                  onClick={() => setCurrency(cur)}
                >
                  {cur}
                </button>
              ))}
            </div>

            <ul className="method-list">
              {methods.map((method, index) => (
                <li
                  key={index}
                  onClick={() => setSelectedMethod(method.id)}
                  className={
                    selectedMethod === method.id
                      ? "method-item active"
                      : "method-item"
                  }
                >
                  <span className="method-icon">
                    <FontAwesomeIcon
                      icon={iconMap[method.icon]}
                      className="method-icon"
                    />
                  </span>
                  {method.name}-{method.id}
                  {method.label && (
                    <span className="recommended">＜{method.label}＞</span>
                  )}
                </li>
              ))}
            </ul>

            {selectedMethod && (
              <div className="amount-options">
                <p className="amount-title">{t("recharge.amount.title")}</p>
                <p className="amount-hint">※{t("recharge.amount.hint")}</p>
                <div className="amount-buttons">
                  {amounts.map((amt, i) => (
                    <button
                      key={i}
                      className={
                        selectedAmount === amt
                          ? "btn--amount selected"
                          : "btn--amount"
                      }
                      onClick={() => setSelectedAmount(amt)}
                    >
                      {amt}
                    </button>
                  ))}
                </div>

                {selectedAmount && (
                  <p className="point-info">
                    {t("recharge.amount.pay")} {selectedAmount.toFixed(2)}{" "}
                    {t("recharge.amount.availablePoints")}{" "}
                    {getPointValue(selectedAmount)}
                  </p>
                )}

                <button
                  className="confirm-btn"
                  onClick={() => {
                    if (selectedAmount && selectedMethod) {
                      setShowConfirmModal(true);
                    }
                  }}
                >
                  {t("recharge.amount.confirm")}
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <AnimatePresence>
        {showConfirmModal && (
          <RechargeConfirmationModal
            methodLabel={
              methods.find((m) => m.id === selectedMethod)?.name +
              "-" +
              selectedMethod +
              (methods.find((m) => m.id === selectedMethod)?.label
                ? " ＜" +
                  methods.find((m) => m.id === selectedMethod)?.label +
                  "＞"
                : "")
            }
            amount={selectedAmount}
            point={getPointValue(selectedAmount)}
            onCancel={() => setShowConfirmModal(false)}
            onConfirm={() => {
              const method = methods.find((m) => m.id === selectedMethod);
              const point = getPointValue(selectedAmount);
              const time = new Date().toISOString();
              const orderId = `Order${time.replace(
                /[-:.TZ]/g,
                ""
              )}${user.id.slice(0, 4)}`;

              axios
                .post(`${API_URL}/transactions`, {
                  userId: user.id,
                  time,
                  paymentMethod: `${method.name}-${method.id}`,
                  orderId,
                  points: point,
                  amount: selectedAmount,
                  status: "processing",
                })
                .then(() => {
                  setShowConfirmModal(false);
                  setShowSuccessModal(true);
                })
                .catch((err) => {
                  console.error("❌ 儲值失敗：", err);
                  setShowConfirmModal(false);
                  alert("儲值失敗，請稍後再試。");
                });
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccessModal && (
          <RechargeSuccessModal
            onClose={() => {
              setShowSuccessModal(false);
              // TODO: 可加上跳轉
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Recharge;
