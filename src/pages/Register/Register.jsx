import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next"; 
import PropTypes from "prop-types";
import "./register.scss";

const InputField = ({ label, type, placeholder, id, value, onChange }) => (
  <div className="input-wrapper">
    <label htmlFor={id} className="register-title-sec">
      {label}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="register-input"
      required
    />
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ username: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("密碼不一致");
      return;
    }

    try {
      await axios.post("http://localhost:5000/users", {
        username: formData.username,
        password: formData.password
      });

      setMessage("✅ 註冊成功！");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("註冊失敗:", error);
      setMessage("註冊失敗，請稍後再試");
    }
  };

  return (
    <div className="register-container">
      <form className="register-case" onSubmit={handleSubmit}>
        <h2 className="register-title">{t("register.title")}</h2>
        <InputField label={t("register.username")} type="text" placeholder={t("register.enterUsername")} id="username" value={formData.username} onChange={handleChange} />
        <InputField label={t("register.password")} type="password" placeholder={t("register.enterPassword")} id="password" value={formData.password} onChange={handleChange} />
        <InputField label={t("register.confirmPassword")} type="password" placeholder={t("register.enterConfirmPassword")} id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
        <button type="submit" className="btn register-btn">{t("register.registerBtn")}</button>
        {message && <p className="message">{message}</p>}
        <p className="privacy-policy">
          {t("register.agreePolicy")}{" "}
          <Link to="/privacy" className="privacy-enter">
            {t("register.privacyPolicy")}
          </Link>
        </p>
      </form>
      <div className="login-case">
        <h2 className="login-title">{t("login-register.alreadyHaveAccount")}</h2>
        <button className="btn-r login-btn" onClick={() => navigate("/login")}>{t("login-register.loginBtn")}</button>
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

export default Register;

