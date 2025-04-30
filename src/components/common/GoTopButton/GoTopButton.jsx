import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./GoTopButton.scss";

const GoTopButton = () => {
  const [isVisible, setIsvisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsvisible(true);
      } else {
        setIsvisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  //   那些路徑不出現GoTopButton
  const hiddenPaths = ["/loading", "/login", "/register"];

  //   如果現在的路徑在hiddenPaths裡面，就直接return null
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="go-top-button"
          initial={{ opacity: 0, scale: 0, right: "-10px" }}
          animate={{ opacity: 0.8, scale: 1, right: "40px" }}
          exit={{ opacity: 0, scale: 0, right: "-10px" }}
          transition={{ duration: 0.35  }}
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default GoTopButton;
