import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const MemberRedirect = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mobile = window.innerWidth <= 768;
    setIsMobile(mobile);
    setReady(true);
  }, []);

  if (!ready) return null; // 還沒判斷出來就先不顯示（避免畫面閃爍）

  return (
    <Navigate to={isMobile ? "/member/mobile" : "/member/points"} replace />
  );
};

export default MemberRedirect;
