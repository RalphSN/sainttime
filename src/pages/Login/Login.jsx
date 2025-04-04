import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { AuthContext } from "../../context/AuthContext"; 
import "./Login.scss";

const InputField = ({ label, type, placeholder, id, value, onChange }) => (
  <div className="input-wrapper">
    <label htmlFor={id} className="login__title-sec">
      {label}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="login-input"
      required
    />
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useContext(AuthContext); // 直接使用 AuthContext 的 login() 方法
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const response = await axios.get(
        `http://localhost:5000/users?username=${formData.username}&password=${formData.password}`
      );

      if (response.data.length > 0) {
        const user = response.data[0]; // 取得用戶資料
        login(user); // 立即更新 AuthContext 裡的 `user`
        localStorage.setItem("userId", user.id); // 把 userId 存進 localStorage
        setMessage("✅ 登入成功！");
        setTimeout(() => navigate("/"), 500); // 立即跳轉回首頁
      } else {
        setMessage("❌ 帳號或密碼錯誤");
      }
    } catch (error) {
      console.error("登入失敗:", error);
      setMessage("❌ 登入失敗，請稍後再試");
    }
  };

  return (
    <div className="login">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2 className="login__title">{t("login.title")}</h2>
        <InputField
          label={t("login.username")}
          type="text"
          placeholder={t("login.enterUsername")}
          id="username"
          value={formData.username}
          onChange={handleChange}
        />
        <InputField
          label={t("login.password")}
          type="password"
          placeholder={t("login.enterPassword")}
          id="password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit" className="btn login-btn">
          {t("login.loginBtn")}
        </button>
        {message && <p className="message">{message}</p>}
        <p className="privacy-policy">
          {t("login.agreePolicy")}{" "}
          <Link to="/privacy" className="privacy-policy__entry">
            {t("login.privacyPolicy")}
          </Link>
        </p>
      </form>
      <div className="register-box">
        <h2 className="login__title">{t("register-login.title")}</h2>
        <button
          className="btn-l btn--register"
          onClick={() => navigate("/register")}
        >
          {t("register-login.registerBtn")}
        </button>
        <button
          className="btn-l btn--forgot"
          onClick={() => navigate("/forgot-password")}
        >
          {t("register-login.forgotPassword")}
        </button>
        <div className="tips">
          <span className="tips__title">{t("tips.loginIssueTitle")}</span>
          <span className="tips__content">{t("tips.loginIssueContent")}</span>
          <span className="tips__title">{t("tips.registerTitle")}</span>
          <span className="tips__content">{t("tips.registerContent")}</span>
        </div>
      </div>
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Login;
