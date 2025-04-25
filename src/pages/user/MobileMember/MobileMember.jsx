import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import {
  faMagnifyingGlassDollar,
  faCommentDots,
  faTicket,
  faPenToSquare,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../components/common/Loading/Loading";
import axios from "axios";
import "./MobileMember.scss";

const API_URL = import.meta.env.VITE_API_URL;

const getLinkClass = ({ isActive }) =>
  isActive ? "menu-item__link active" : "menu-item__link";

const MobileMember = () => {
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem("userId");
  const { t } = useTranslation();

  useEffect(() => {
    if (!userId) return;
    axios.get(`${API_URL}/users/${userId}`).then((res) => {
      setUser(res.data);
    });
  }, [userId]);

  if (!user) return <Loading />;

  return (
    <div className="mobile-member">
      <div className="user-info">
        <div className="user-avatar">
          <FontAwesomeIcon icon={faUser} className="fa-user" />
        </div>
        <p className="username">{user.nickname}</p>
        <div className="user-property">
          <div className="user-property__content">
            <h2 className="user-property__title">總資產</h2>
            <p className="points">
              {user.points}{" "}
              <span className="points__text">{t("member.points")}</span>
            </p>
          </div>
          <NavLink
            to="/member/recharge"
            className={`btn--recharge ${getLinkClass}`}
          >
            儲值
          </NavLink>
        </div>
      </div>
      <nav className="menu">
        <ul className="menu-list">
          <li className="menu-item">
            <NavLink to="/member/points" className={getLinkClass}>
              <FontAwesomeIcon
                icon={faMagnifyingGlassDollar}
                className="menu-icon"
              />
              {t("member.menu.checkPoints")}
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/member/service" className={getLinkClass}>
              <FontAwesomeIcon icon={faCommentDots} className="menu-icon" />

              {t("member.menu.customerService")}
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/member/certificate" className={getLinkClass}>
              <FontAwesomeIcon icon={faTicket} className="menu-icon" />
              {t("member.menu.myCertificates")}
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/member/password" className={getLinkClass}>
              <FontAwesomeIcon icon={faPenToSquare} className="menu-icon" />
              {t("member.menu.changePassword")}
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/member/reserve" className={getLinkClass}>
              <FontAwesomeIcon icon={faCircleCheck} className="menu-icon" />
              {t("member.menu.myBookings")}
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MobileMember;
