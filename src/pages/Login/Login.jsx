import { Link } from "react-router-dom";
import "./login.scss";

const Login = () => {
  return (
    <div className="login-container">
      {/* 左側：登入表單 */}
      <div className="login-box">
        <h2 className="login-title">會員登入</h2>
        <label className="login-title-sec">帳號</label>
        <input type="text" placeholder="請輸入帳號" className="login-input" />
        <label className="login-title-sec">密碼</label>
        <input type="password" placeholder="請輸入密碼" className="login-input" />
        <button className="btn login-btn">登入帳號</button>
        <p className="privacy-policy">
          登入表示同意本網站 <Link to="/privacy" className="privacy-enter">隱私權條款</Link>
        </p>
      </div>

      {/* 右側：註冊區塊 */}
      <div className="register-box">
        <h2 className="login-title">還沒有帳號？</h2>
        <Link to="/register" className="btn-l register-btn">
          註冊帳號（免費）
        </Link>
        <Link to="/forgot-password" className="btn-l forgot-btn">
          忘記密碼
        </Link>
        <p className="tips">
          <span className="tips-title">帳號、密碼輸入不正確的情形</span>
          確認英文大小寫、數字是否正確，再次正確輸入資料
          <span className="tips-title">如何註冊會員呢？</span>
          尚未註冊會員請用 <Link to="/register">【註冊帳號】</Link> 來創建帳號
        </p>
      </div>
    </div>
  );
};

export default Login;
