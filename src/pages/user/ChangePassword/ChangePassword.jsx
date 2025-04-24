import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { AuthContext } from "../../../context/AuthContext";
import "./ChangePassword.scss";

const API_URL = import.meta.env.VITE_API_URL;

const InputField = ({
  label,
  type,
  placeholder,
  id,
  value,
  onChange,
  readOnly = false,
}) => (
  <div className="input-wrapper">
    <label htmlFor={id} className="cp__label">
      {" "}
      {label}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="cp-input"
      required={!readOnly}
      readOnly={readOnly}
      autoComplete={type === "password" ? "new-password" : "off"}
    />
  </div>
);

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
};

const ChangePassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  // State for form fields and messages
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get userId and username, prioritize context, fallback to localStorage
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    let id = null;
    let name = "";

    if (user && user.id) {
      id = user.id;
      name = user.username || "";
    } else {
      id = localStorage.getItem("userId");
      console.warn(
        "User context not found, falling back to localStorage for userId."
      );
    }

    if (!id) {
      console.error("User ID not found. Cannot change password.");
      setMessage(t("changePassword.noId"));
      window.location.href = "/login";
    } else {
      setUserId(id);
      setUsername(name);
    }
  }, [user, navigate]);

  // Handlers for input changes
  const handleCurrentPasswordChange = (e) => setCurrentPassword(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    setIsLoading(true);

    if (!userId) {
      setMessage(t("changePassword.noUserId"));
      setIsLoading(false);
      window.location.href = "/login";
      return;
    }

    // --- Basic Validations ---
    if (newPassword !== confirmPassword) {
      setMessage(t("changePassword.noSamePwd"));
      setIsLoading(false);
      return;
    }
    if (!currentPassword || !newPassword) {
      setMessage(t("changePassword.fillAll"));
      setIsLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      setMessage(t("changePassword.needLength"));
      setIsLoading(false);
      return;
    }

    try {
      const userCheckResponse = await axios.get(`${API_URL}/users/${userId}`);
      const storedPassword = userCheckResponse.data.password;

      if (storedPassword !== currentPassword) {
        setMessage(t("changePassword.currentError"));
        setIsLoading(false);
        return;
      }

      await axios.patch(`${API_URL}/users/${userId}`, {
        password: newPassword,
      });

      setMessage(t("changePassword.changeSuccess"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(t("changePassword.changeFailed"), error);
      if (error.response && error.response.status === 404) {
        setMessage(t("changePassword.noAccount"));
      } else {
        setMessage(t("changePassword.changeFailed2"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      {" "}
      <form className="change-password-box" onSubmit={handleSubmit}>
        <h2 className="cp__title">{t("changePassword.title")}</h2>{" "}
        {/* Display Username (Read-only) */}
        <InputField
          label={t("changePassword.username")}
          type="text"
          id="username"
          value={username || "Loading..."}
          readOnly={true}
        />
        {/* Current Password */}
        <InputField
          label={t("changePassword.currentPassword")}
          type="password"
          placeholder={t("changePassword.enterCurrentPassword")}
          id="currentPassword"
          value={currentPassword}
          onChange={handleCurrentPasswordChange}
        />
        {/* New Password */}
        <InputField
          label={t("changePassword.newPassword")}
          type="password"
          placeholder={t("changePassword.enterNewPassword")}
          id="newPassword"
          value={newPassword}
          onChange={handleNewPasswordChange}
        />
        {/* Confirm New Password */}
        <InputField
          label={t("changePassword.confirmPassword")}
          type="password"
          placeholder={t("changePassword.confirmNewPassword")}
          id="confirmPassword"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
        {/* Submit Button */}
        <button type="submit" className="btn cp-btn" disabled={isLoading}>
          {isLoading
            ? t("changePassword.saving")
            : t("changePassword.confirmBtn")}
        </button>
        {/* Message Display */}
        {message && (
          <p
            className={`message ${
              message.startsWith("✅") ? "success" : "error"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default ChangePassword;
