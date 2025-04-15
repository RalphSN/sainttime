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

const RechargeConfirmationModal = ({
  methodLabel,
  amount,
  point,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      className="modal-recharge-backdrop"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="modal-recharge"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
      >
        <h3 className="modal-title">{t("rechargeModal.title")}</h3>
        <div className="modal-content">
          <p>{t("rechargeModal.type")}：{methodLabel}</p>
          <p>{t("rechargeModal.amount")}：{amount.toFixed(2)}</p>
          <p>{t("rechargeModal.points")}：{point}</p>
        </div>
        <div className="modal-buttons">
          <button onClick={onCancel} className="btn--modal cancel">
          {t("rechargeModal.thinking")}
          </button>
          <button onClick={onConfirm} className="btn--modal confirm">
          {t("rechargeModal.send")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RechargeConfirmationModal;
