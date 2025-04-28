import { useState, useEffect } from "react";
import "./AgeGateModal.scss";

const AgeGateModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [noRemind, setNoRemind] = useState(false);

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
        <h2 className="age-gate__title">你滿18歲了嗎？</h2>
        <p className="age-gate__content">
          本網站可能涉及成人內容，未滿18歲請勿進入
        </p>
        <div className="no-remind">
          <input
            type="checkbox"
            id="noRemind"
            checked={noRemind}
            onChange={(e) => setNoRemind(e.target.checked)}
          />
          <label htmlFor="noRemind">不再提醒</label>
        </div>
        <button className="btn--age btn--18aged" onClick={handleConfirm}>
          是，我已年滿18歲並同意
        </button>
        <button className="btn--age btn--under18aged" onClick={handleDeny}>
          不，我還未滿18歲
        </button>
      </div>
    </div>
  );
};

export default AgeGateModal;
