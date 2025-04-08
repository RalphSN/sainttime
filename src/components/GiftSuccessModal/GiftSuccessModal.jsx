import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import "./GiftSuccessModal.scss";

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

const GiftSuccessModal = ({ code, onClose }) => {
  const { t } = useTranslation();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert("已複製！");
  };

  return (
    <motion.div
      className="modal-backdrop"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        className="modal"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()} // 阻止點到 modal 也觸發關閉
      >
        <h2 className="modal__title">{t("modal.title")}</h2>
        <p className="modal__content">{t("modal.content")}</p>
        <p className="card-code">
          {t("modal.code")}：{code}
        </p>
        <div className="btn-container">
          <button onClick={handleCopy} className="btn--copy">
            {t("modal.copy")}
          </button>
          <button onClick={onClose} className="btn--confirm">
            {t("modal.confirm")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GiftSuccessModal;
