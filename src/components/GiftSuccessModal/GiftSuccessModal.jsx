import "./GiftSuccessModal.scss";

const GiftSuccessModal = ({ code, onClose }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert("已複製！");
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>領取成功</h2>
        <p>恭喜您領取成功！</p>
        <p>卡號：{code}</p>
        <button onClick={handleCopy}>複製</button>
        <p>您的禮包已領取成功，請點擊複製</p>
        <button onClick={onClose}>確定</button>
      </div>
    </div>
  );
};

export default GiftSuccessModal;