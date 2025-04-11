import "./RechargeSuccessModal.scss";

const RechargeSuccessModal = ({ onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="success-icon">✔</div>
        <h3>已送出確認</h3>
        <p>若無出現支付畫面，請注意視窗是否被瀏覽器阻擋</p>
        <button onClick={onClose} className="confirm">確定</button>
      </div>
    </div>
  );
};

export default RechargeSuccessModal;
