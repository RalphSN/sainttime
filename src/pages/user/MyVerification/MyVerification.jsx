import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "qrcode";
import "./MyVerification.scss";

export default function QRCodeVerification() {
  const canvasRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const canvas = canvasRef.current;
    QRCode.toCanvas(
      canvas,
      "https://example.com/your-verification-token",
      {
        width: 250,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      },
      function (error) {
        if (error) console.error(error);
      }
    );
  }, []);

  return (
    <div className="qrcode-wrapper">
      <div className="qrcode-box">
        <h2 className="qrcode__title">{t("verification.title")}</h2>
        <p className="qrcode__subtitle">{t("verification.subtitle")}</p>
        <canvas ref={canvasRef} className="qrcode__canvas" />
        <div className="qrcode__note">
          <p>{t("verification.note")}</p>
          <p className="qrcode__tip">{t("verification.tip")}</p>
        </div>
      </div>
    </div>
  );
}
