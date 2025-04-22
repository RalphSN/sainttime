import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Sidebar from "../../common/Sidebar/Sidebar";
import Loading from "../../common/Loading/Loading";
import "./MemberLayout.scss";

const API_URL = import.meta.env.VITE_API_URL;

const MemberLayout = () => {
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

  const subTitleMap = {
    "/member/recharge": t("member.menu.recharge"),
    "/member/points": t("member.menu.checkPoints"),
    "/member/service": t("member.menu.customerService"),
    "/member/certificates": t("member.menu.myCertificates"),
    "/member/password": t("member.menu.changePassword"),
    "/member/bookings": t("member.menu.myBookings"),
    "/member": t("member.count"),
  };

  const currentPath = location.pathname;
  const currentSubTitle = subTitleMap[currentPath] || "";

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
        <span className="breadcrumb-current">{currentSubTitle}</span>
      </nav>
      {/* =====Breadcrumbs=====END */}

      <h1 className="member__title">{t("member.title")}</h1>

      <div className="member-box">
        <Sidebar user={user} />
        <Outlet context={[user]} />
      </div>
    </div>
  );
};

export default MemberLayout;
