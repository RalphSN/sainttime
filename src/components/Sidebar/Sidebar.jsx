import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.scss"; 
const Sidebar = ({ user }) => {
  const { t } = useTranslation();
  
  const getLinkClass = ({ isActive }) =>
    isActive ? "menu-item__link active" : "menu-item__link";


  return (
    <aside className="sidebar">
      <div className="user-info">
        <div className="user-avatar">
          <FontAwesomeIcon icon={faUser} className="fa-user" />
        </div>
        <p className="username">{user.nickname}</p>
        <p className="points">
          {user.points}{" "}
          <span className="points__text">{t("member.points")}</span>
        </p>
      </div>
      <nav className="menu">
        <ul>
          <li className="menu-item">
            <NavLink to="/member/recharge" className={getLinkClass}>
              {t("member.menu.recharge")}
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/member/points" className={getLinkClass}>
              {t("member.menu.checkPoints")}
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/member/service" className={getLinkClass}>
              {t("member.menu.customerService")}
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/member/certificates" className={getLinkClass}>
              {t("member.menu.myCertificates")}
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/member/password" className={getLinkClass}>
              {t("member.menu.changePassword")}
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/member/bookings" className={getLinkClass}>
              {t("member.menu.myBookings")}
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
