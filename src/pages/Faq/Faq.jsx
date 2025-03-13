import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import "./Faq.scss";
import "../../scss/common.scss";

const Faq = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(null);

  const faqListRef = useRef(null);
  const faqData = t("faq",{ returnObjects: true });
  const faqEntries = Object.entries(faqData);

  // 生成 FAQ 列表
  const faqs = faqEntries
    .filter(([key]) => key.startsWith("Q"))
    .map(([qKey, question]) => {
      const aKey = qKey.replace("Q", "A");
      return {
        question,
        answer: faqData[aKey] || "",
      };
    });
   console.log(faqData);

  // 點擊外部關閉 FAQ
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (faqListRef.current && !faqListRef.current.contains(event.target)) {
        setActiveIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="faq">
      {/* =====Breadcrumbs=====START */}
      <nav className="breadcrumb">
        <a href="/" className="breadcrumb-item">
          <FontAwesomeIcon icon={faHouse} className="icon" />
          {t("breadcrumb.home")}
        </a>
        <span className="breadcrumb-separator"> &gt; </span>
        <span className="breadcrumb-current">{t("breadcrumb.faq")}</span>
      </nav>
      {/* =====Breadcrumbs=====END */}

      <h1 className="faq__title">{t("faq.title")}</h1>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={activeIndex === index}
            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
          />
        ))}
      </div>
    </div>
  );
};

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  
  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`}>
      <button className="faq-question" onClick={onClick}>
        {question}
        <span>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
      </button>
      <div
        className="faq-answer-container"
        style={{ maxHeight: isOpen ? "200px" : "0" }}
      >
        <div className="faq-answer">{answer}</div>
      </div>
    </div>
  );
};

FAQItem.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Faq;
