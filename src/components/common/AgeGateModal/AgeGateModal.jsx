import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./AgeGateModal.scss";

const AgeGateModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [noRemind, setNoRemind] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const ageVerified = localStorage.getItem("ageVerified");
    if (ageVerified !== "true") {
      setShowModal(true);
    }
  }, []);

  const handleConfirm = () => {
    if (noRemind) {
      localStorage.setItem("ageVerified", "true");
    }
    setShowModal(false);
  };

  const handleDeny = () => {
    window.location.href = "https://www.google.com";
  };

  if (!showModal) return null;

  return (
    <div className="age-gate__container">
      <div className="age-gate">
        <h2 className="age-gate__title">{t("ageGate.title")}</h2>
        <p className="age-gate__content">
          {t("ageGate.content1")}<br/>{t("ageGate.content2")}
        </p>
        <div className="no-remind">
          <input
            type="checkbox"
            id="noRemind"
            checked={noRemind}
            onChange={(e) => setNoRemind(e.target.checked)}
          />
          <label htmlFor="noRemind">{t("ageGate.noRemind")}</label>
        </div>
        <button className="btn--age btn--18aged" onClick={handleConfirm}>
          {t("ageGate.18aged")}
        </button>
        <button className="btn--age btn--under18aged" onClick={handleDeny}>
          {t("ageGate.under18aged")}
        </button>
      </div>
    </div>
  );
};

export default AgeGateModal;
