import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "./RechargeModal.scss";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
};

const RechargeSuccessModal = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      className="modal-recharge-backdrop"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        className="modal-recharge"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()} // 阻止點到 modal 也觸發關閉
      >
        <h3 className="modal-title">
          <div className="success-icon">✔</div>
          {t("rechargeModal.alreadyConfirmed")}
        </h3>
        <p className="modal-text">
          {t("rechargeModal.hint1")}
          <br />
          {t("rechargeModal.hint2")}
        </p>
        <button onClick={onClose} className="btn--modal confirm">
          {t("rechargeModal.confirm")}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default RechargeSuccessModal;
