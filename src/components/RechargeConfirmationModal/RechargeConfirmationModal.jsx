import "./RechargeConfirmationModal.scss";

const RechargeConfirmationModal = ({ methodLabel, amount, point, onConfirm, onCancel }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>充值訂單確認</h3>
        <p>付款類型：{methodLabel}</p>
        <p>充值金額：{amount.toFixed(2)}</p>
        <p>到帳點數：{point}</p>
        <div className="modal-buttons">
          <button onClick={onCancel} className="cancel">再想想</button>
          <button onClick={onConfirm} className="confirm">送出資料</button>
        </div>
      </div>
    </div>
  );
};

export default RechargeConfirmationModal;