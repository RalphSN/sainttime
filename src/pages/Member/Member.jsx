import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser } from "@fortawesome/free-solid-svg-icons";
import "../../scss/common.scss";
import "./Member.scss";

const Member = () => {
  const { t } = useTranslation();

  return (
    <div className="member-container">
      {/* =====Breadcrumbs=====START */}
      <nav className="breadcrumb">
        <a href="/" className="breadcrumb-item">
          <FontAwesomeIcon icon={faHouse} className="icon" />
          {t("breadcrumb.home")}
        </a>
        <span className="breadcrumb-separator"> &gt; </span>
        <a href="/member" className="breadcrumb-item">
          {t("member.title")}
        </a>
        <span className="breadcrumb-separator"> &gt; </span>
        <span className="breadcrumb-current">{t("member.count")}</span>
      </nav>
      {/* =====Breadcrumbs=====END */}

      <h1 className="member__title">{t("member.title")}</h1>

      <div className="member-box">
      <aside className="sidebar">
        <div className="user-info">
          <div className="user-avatar">
            <FontAwesomeIcon icon={faUser} className="fa-user"/>
          </div>
          <p className="username">ralphsn2025</p>
          <p className="points">6000 <span className="points__text">點</span></p>
        </div>
        <nav className="menu">
          <ul>
            <li className="menu-item">
              <a href="#" className="menu-item__link">儲值</a>
            </li>
            <li className="menu-item active">
              <a href="#" className="menu-item__link">點數查詢</a>
            </li>
            <li className="menu-item">
              <a href="#" className="menu-item__link">聯繫客服</a>
            </li>
            <li className="menu-item">
              <a href="#" className="menu-item__link">我的優惠</a>
            </li>
            <li className="menu-item">
              <a href="#" className="menu-item__link">修改密碼</a>
            </li>
            <li className="menu-item">
              <a href="#" className="menu-item__link">我的預約</a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="points-content">
        <section className="points-check">
          <h2 className="points__title">點數查詢</h2>
          <p className="remaining-points">
            剩餘點數 <span className="points-value">6000</span>
          </p>

          <div className="transaction-list">
            <div className="transaction">
              <p className="time">2025-02-10 11:12:14</p>
              <p className="payment-method">微信-C01</p>
              <p className="order-id">
                訂單號：<strong>SaintTime20250210111213721872qg9</strong>
              </p>
              <p className="points-detail">
                <span className="points-amount">1000 點</span>
                儲值金額：10
                <span className="status success">已支付</span>
              </p>
            </div>

            <div className="transaction">
              <p className="time">2025-02-10 11:12:04</p>
              <p className="payment-method">支付寶-M01</p>
              <p className="order-id">
                訂單號：<strong>SaintTime20250210111203876782zh9</strong>
              </p>
              <p className="points-detail">
                <span className="points-amount">5000 點</span>
                儲值金額：50
                <span className="status success">已支付</span>
              </p>
            </div>
          </div>
        </section>
      </main>
      </div>

    </div>
  );
};

export default Member;
