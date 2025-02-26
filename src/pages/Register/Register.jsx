import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next"; // 引入 i18n
import "./register.scss";

const InputField = ({ label, type, placeholder, id }) => (
  <div className="input-wrapper">
    <label htmlFor={id} className="register-title-sec">
      {label}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      className="register-input"
      required
    />
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // 只使用 t() 來獲取翻譯

  return (
    <div className="register-container">
      {/* 左側：註冊表單 */}
      <form className="register-case">
        <h2 className="register-title">{t("register.title")}</h2>
        <InputField
          label={t("register.username")}
          type="text"
          placeholder={t("register.enterUsername")}
          id="username"
        />
        <InputField
          label={t("register.password")}
          type="password"
          placeholder={t("register.enterPassword")}
          id="password"
        />
        <InputField
          label={t("register.confirmPassword")}
          type="password"
          placeholder={t("register.enterConfirmPassword")}
          id="confirm-password"
        />
        <button type="submit" className="btn register-btn">
          {t("register.registerBtn")}
        </button>
        <p className="privacy-policy">
          {t("register.agreePolicy")} {" "}
          <Link to="/privacy" className="privacy-enter">
            {t("register.privacyPolicy")}
          </Link>
        </p>
      </form>

      {/* 右側：登入區塊 */}
      <div className="login-case">
        <h2 className="login-title">{t("login-register.alreadyHaveAccount")}</h2>
        <button className="btn-r login-btn" onClick={() => navigate("/login")}>
          {t("login-register.loginBtn")}
        </button>
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

export default Register;

