import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./ForgotPassword.scss";

const ForgotPassword = () => {
  const { register, handleSubmit } = useForm();
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [uploads, setUploads] = useState([]);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length + files.length > 3) {
      setMessage(t("forgotPassword.maxFiles"));
      return;
    }
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles].slice(0, 3));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*,application/pdf",
    maxSize: 5 * 1024 * 1024,
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/uploads")
      .then((response) => setUploads(response.data))
      .catch((error) => console.error(t("forgotPassword.fetchError"), error));
  }, [t]);

  const onSubmit = async (data) => {
    if (files.length === 0) {
      setMessage(t("forgotPassword.uploadRequired"));
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

      await Promise.all(uploadPromises);

      setMessage(t("forgotPassword.success"));
      setFiles([]);
      setUploads((prev) => [
        ...prev,
        ...files.map((file) => ({
          email: data.email,
          fileName: file.name,
          timestamp: new Date().toISOString(),
        })),
      ]);
    } catch (error) {
      console.error(t("forgotPassword.submitError"), error);
      setMessage(t("forgotPassword.submitError"));
    }
  };

  return (
    <div className="forgot-password">
      <h2 className="forgot-password__title">{t("forgotPassword.title")}</h2>
      <form className="forgot-password__form" onSubmit={handleSubmit(onSubmit)}>
        <label className="forgot-password__label">
          {t("forgotPassword.emailLabel")}:
        </label>
        <input
          type="email"
          {...register("email", { required: true })}
          placeholder={t("forgotPassword.emailPlaceholder")}
          className="input-email"
        />

        <label className="forgot-password__label">
          {t("forgotPassword.uploadLabel")}:
        </label>
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <FontAwesomeIcon icon={faCloudArrowUp} className="upload-icon" />
          {files.length > 0 ? (
            <ul className="upload-list">
              {files.map((file, index) => (
                <li key={index} className="upload-text">
                  {file.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="upload-text">
              {t("forgotPassword.uploadPlaceholder")}
            </p>
          )}
        </div>

        <button type="submit" className="upload-btn">
          {t("forgotPassword.submit")}
        </button>
      </form>

      {message && (
        <p
          className={`message ${
            message.includes(t("forgotPassword.success")) ? "success" : "error"
          }`}
        >
          {message}
        </p>
      )}

      <div className="upload-history">
        <h3 className="upload-history__title">
          {t("forgotPassword.historyTitle")}
        </h3>
        <ul className="upload-history__content">
          {uploads.length > 0 ? (
            uploads.map((upload, index) => (
              <li key={index} className="upload-history__item">
                {upload.email} {t("forgotPassword.uploaded")}{" "}
                <strong>{upload.fileName}</strong>（
                {new Date(upload.timestamp).toLocaleString()}）
              </li>
            ))
          ) : (
            <p>{t("forgotPassword.noHistory")}</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ForgotPassword;
