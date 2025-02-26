import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import "./forgot-password.scss";

const ForgotPassword = () => {
  const { register, handleSubmit } = useForm();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploads, setUploads] = useState([]);

  // 處理文件拖放
  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
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
    if (!file) {
      setMessage("請上傳憑證文件");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/uploads", {
        email: data.email,
        fileName: file.name,
        timestamp: new Date().toISOString(),
      });

      setMessage("提交成功！請檢查您的電子郵件");
      setUploads((prev) => [...prev, response.data]); // 更新 UI 顯示
    } catch (error) {
      console.error("提交失敗:", error);
      setMessage("提交失敗，請稍後再試");
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>忘記密碼</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 電子郵件輸入框 */}
        <label>電子郵件：</label>
        <input
          type="email"
          {...register("email", { required: true })}
          placeholder="請輸入您的電子郵件"
        />

        {/* 拖放上傳區域 */}
        <label>上傳憑證：</label>
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <FontAwesomeIcon icon={faCloudArrowUp} className="upload-icon" />
          {file ? <p>{file.name}</p> : <p>拖放或點擊上傳文件</p>}
        </div>

        {/* 提交按鈕 */}
        <button type="submit">提交</button>
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
        <h3>上傳紀錄</h3>
        <ul>
          {uploads.length > 0 ? (
            uploads.map((upload) => (
              <li key={upload.id}>
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
