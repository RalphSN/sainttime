import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import RechargeConfirmationModal from "../../components/RechargeConfirmationModal/RechargeConfirmationModal";
import RechargeSuccessModal from "../../components/RechargeSuccessModal/RechargeSuccessModal";
import "./Recharge.scss";

const Recharge = () => {
  const { t } = useTranslation();
  const [user] = useOutletContext();

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
    axios
      .get(`http://localhost:5000/paymentMethods?currency=${currency}`)
      .then((res) => {
        setMethods(res.data);
      });
  }, [currency]);

  useEffect(() => {
    setSelectedAmount(null);
    if (selectedMethod) {
      axios
        .get(
          `http://localhost:5000/paymentAmounts?currency=${currency}&methodId=${selectedMethod}`
        )
        .then((res) => {
          if (res.data.length > 0) {
            setAmounts(res.data[0].amounts);
          }
        });
    }
  }, [selectedMethod, currency]);

  const getPointValue = (amount) => {
    return amount * 100; // 假設 1 元可兌換 100 點
  };

  return (
    <>
      <main className="recharge-content">
        <section className="recharge-check">
          <h2 className="recharge__title">{t("member.menu.recharge")}</h2>
          <p>
            儲值遇到問題？請前往《<a>聯繫客服</a>》由專人為您服務
          </p>
          <div className="payment-methods">
            <div className="currency-tabs">
              <button
                className={currency === "CNY" ? "active" : ""}
                onClick={() => setCurrency("CNY")}
              >
                CNY
              </button>
              <button
                className={currency === "TWD" ? "active" : ""}
                onClick={() => setCurrency("TWD")}
              >
                TWD
              </button>
            </div>

            <ul className="method-list">
              {methods.map((method, index) => (
                <li
                  key={index}
                  onClick={() => setSelectedMethod(method.id)}
                  className={selectedMethod === method.id ? "active" : ""}
                >
                  <span>{method.icon}</span>
                  {method.name}-{method.id}
                  {method.label && <span>＜{method.label}＞</span>}
                </li>
              ))}
            </ul>

            {selectedMethod && (
              <div className="amount-options">
                <p className="amount-title">請選擇充值金額</p>
                <p className="amount-hint">
                  ※
                  支付寶用戶若於點選確定後，未跳出二維碼，請嘗試開啟VPN後再次進行充值！
                </p>
                <div className="amount-buttons">
                  {amounts.map((amt, i) => (
                    <button
                      key={i}
                      className={selectedAmount === amt ? "selected" : ""}
                      onClick={() => setSelectedAmount(amt)}
                    >
                      {amt}
                    </button>
                  ))}
                </div>

                {selectedAmount && (
                  <p className="point-info">
                    支付 {selectedAmount.toFixed(2)} 可兌換點數{" "}
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
                  確定
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

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
              .post("http://localhost:5000/transactions", {
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

      {showSuccessModal && (
        <RechargeSuccessModal
          onClose={() => {
            setShowSuccessModal(false);
            // TODO: 可加上跳轉
          }}
        />
      )}
    </>
  );
};

export default Recharge;
