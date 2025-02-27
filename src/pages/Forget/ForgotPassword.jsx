import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import "./forgot-password.scss";

const ForgotPassword = () => {
  const { register, handleSubmit } = useForm();
  const [files, setFiles] = useState([]); // 應該是陣列，而不是 null
  const [message, setMessage] = useState("");
  const [uploads, setUploads] = useState([]);

  // 處理文件拖放
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length + files.length > 3) {
      setMessage("最多只能上傳 3 個檔案");
      return;
    }
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles].slice(0, 3)); // 確保不超過 3 個
  };
  

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*,application/pdf",
    maxSize: 5 * 1024 * 1024, // 限制 5MB
  });

  // 取得上傳紀錄
  useEffect(() => {
    axios
      .get("http://localhost:5000/uploads")
      .then((response) => setUploads(response.data))
      .catch((error) => console.error("獲取失敗", error));
  }, []);

  // 表單提交處理
  const onSubmit = async (data) => {
    if (files.length === 0) {
      setMessage("請上傳憑證文件");
      return;
    }

    try {
      const uploadPromises = files.map((file) =>
        axios.post("http://localhost:5000/uploads", {
          email: data.email,
          fileName: file.name,
          timestamp: new Date().toISOString(),
        })
      );

      await Promise.all(uploadPromises); // 等待所有檔案上傳完成

      setMessage("提交成功！請檢查您的電子郵件");
      setFiles([]); // 清空檔案列表
      setUploads((prev) => [
        ...prev,
        ...files.map((file) => ({
          email: data.email,
          fileName: file.name,
          timestamp: new Date().toISOString(),
        })),
      ]);
    } catch (error) {
      console.error("提交失敗:", error);
      setMessage("提交失敗，請稍後再試");
    }
  };

  return (
    <div className="forgot-password-container">
      <h2 className="forgot-password-title">忘記密碼</h2>
      <form className="forgot-password-form" onSubmit={handleSubmit(onSubmit)}>
        {/* 電子郵件輸入框 */}
        <label className="forgot-password-label">電子郵件：</label>
        <input
          type="email"
          {...register("email", { required: true })}
          placeholder="請輸入您的電子郵件"
          className="email-input"
        />

        {/* 拖放上傳區域 */}
        <label className="forgot-password-label">上傳憑證（最多 3 個檔案）：</label>
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <FontAwesomeIcon icon={faCloudArrowUp} className="upload-icon" />
          {files.length > 0 ? (
            <ul className="upload-list">
              {files.map((file, index) => (
                <li key={index} className="upload-text">{file.name}</li>
              ))}
            </ul>
          ) : (
            <p className="upload-text">拖放或點擊上傳文件</p>
          )}
        </div>

        {/* 提交按鈕 */}
        <button type="submit" className="upload-btn">提交</button>
      </form>

      {/* 提示信息 */}
      {message && (
        <p
          className={`message ${
            message.includes("成功") ? "success" : "error"
          }`}
        >
          {message}
        </p>
      )}

      {/* 顯示上傳紀錄 */}
      <div className="upload-history">
        <h3 className="upload-history-title">上傳紀錄</h3>
        <ul className="upload-history-content">
          {uploads.length > 0 ? (
            uploads.map((upload, index) => (
              <li key={index}>
                {upload.email} 上傳了 <strong>{upload.fileName}</strong>（
                {new Date(upload.timestamp).toLocaleString()}）
              </li>
            ))
          ) : (
            <p>尚無上傳紀錄</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ForgotPassword;
