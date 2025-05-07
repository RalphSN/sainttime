import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import "./AgeGateModal.scss";

const AgeGateModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [noRemind, setNoRemind] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    try {
      const ageVerified = localStorage.getItem("ageVerified");
      if (ageVerified !== "true") {
        setIsVisible(true);
      }
    } catch (err) {
      console.warn("LocalStorage access failed:", err);
      setIsVisible(true);
    }
  }, []);

  const handleConfirm = () => {
    if (noRemind) {
      localStorage.setItem("ageVerified", "true");
    }
    setTimeout(() => setIsVisible(false), 200);
  };

  const handleDeny = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="age-gate__container"
          role="dialog"
          aria-labelledby="ageGateTitle"
          aria-describedby="ageGateContent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="age-gate"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="age-gate__title" id="ageGateTitle">
              {t("ageGate.title")}
            </h2>
            <p className="age-gate__content" id="ageGateContent">
              {t("ageGate.content1")}
              <br />
              {t("ageGate.content2")}
            </p>
            <div className="no-remind">
              <input
                type="checkbox"
                id="noRemind"
                checked={noRemind}
                className="no-remind__checkbox"
                onChange={(e) => setNoRemind(e.target.checked)}
              />
              <label htmlFor="noRemind" className="no-remind__label">
                {t("ageGate.noRemind")}
              </label>
            </div>
            <button className="btn--age btn--18aged" onClick={handleConfirm}>
              {t("ageGate.18aged")}
            </button>
            <button className="btn--age btn--under18aged" onClick={handleDeny}>
              {t("ageGate.under18aged")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AgeGateModal;
