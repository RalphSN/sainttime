import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next"; // 引入 i18n
import "./login.scss";

const InputField = ({ label, type, placeholder, id }) => (
  <div className="input-wrapper">
    <label htmlFor={id} className="login-title-sec">
      {label}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      className="login-input"
      required
    />
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // 只使用 t() 來獲取翻譯

  return (
    <div className="login-container">
      {/* 左側：登入表單 */}
      <form className="login-box">
        <h2 className="login-title">{t("login.title")}</h2>
        <InputField
          label={t("login.username")}
          type="text"
          placeholder={t("login.enterUsername")}
          id="username"
        />
        <InputField
          label={t("login.password")}
          type="password"
          placeholder={t("login.enterPassword")}
          id="password"
        />
        <button type="submit" className="btn login-btn">
          {t("login.loginBtn")}
        </button>
        <p className="privacy-policy">
          {t("login.agreePolicy")}{" "}
          <Link to="/privacy" className="privacy-enter">
            {t("login.privacyPolicy")}
          </Link>
        </p>
      </form>

      {/* 右側：註冊區塊 */}
      <div className="register-box">
        <h2 className="login-title">{t("register-login.title")}</h2>
        <button
          className="btn-l register-btn"
          onClick={() => navigate("/register")}
        >
          {t("register-login.registerBtn")}
        </button>
        <button
          className="btn-l forgot-btn"
          onClick={() => navigate("/forgot-password")}
        >
          {t("register-login.forgotPassword")}
        </button>
        <div className="tips">
          <span className="tips-title">{t("tips.loginIssueTitle")}</span>
          <span className="tips-content">{t("tips.loginIssueContent")}</span>
          <span className="tips-title">{t("tips.registerTitle")}</span>
          <span className="tips-content">{t("tips.registerContent")}</span>
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
};

export default Login;
