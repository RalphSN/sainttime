import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import ChatBox from "../../../components/common/ChatBox/ChatBox";
import LoadingSmall from "../../../components/common/Loading/LoadingSmall";
import axios from "axios";
import "./ComplaintForm.scss";

const MAX_FILES = 5;
const API_URL = import.meta.env.VITE_API_URL;

function SortableImage({ id, url, onRemove, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      className="sortable-image"
      style={style}
      {...attributes}
    >
      <img src={url} alt="preview" onClick={() => onClick(url)} />

      {/* 拖曳手把，只限制這個小區域可以拖曳 */}
      <div className="drag-handle" {...listeners}>
        ☰
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // 防止觸發圖片 onClick 預覽
          onRemove(id);
        }}
        className="btn--remove"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
}

const ComplaintForm = () => {
  const [type, setType] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [lightbox, setLightbox] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [activeFeedback, setActiveFeedback] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { t } = useTranslation();

  const sensors = useSensors(useSensor(PointerSensor));
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId") || null;

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    axios.get(`${API_URL}/feedbacks?userId=${userId}`).then((res) => {
      setFeedbacks(res.data);
    });
  }, [userId, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files
      .slice(0, MAX_FILES - images.length)
      .map((file, index) => ({
        id: `${file.name}-${Date.now()}`,
        file,
        url: URL.createObjectURL(file),
      }));
    setImages((prev) => [...prev, ...newImages]);
    fileInputRef.current.value = null;
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const items = Array.from(e.dataTransfer.items);

    // 避免從頁面內部 <img> 拖進來：不是來自檔案系統的不處理
    const isRealFile = items.some((item) => {
      const entry = item.webkitGetAsEntry?.();
      return entry && entry.isFile;
    });

    if (!isRealFile) return;

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    const existingFileKeys = new Set(
      images.map((img) => img.file?.name + "-" + img.file?.size)
    );

    const newImages = files
      .filter((file) => {
        const key = file.name + "-" + file.size;
        return !existingFileKeys.has(key);
      })
      .slice(0, MAX_FILES - images.length)
      .map((file, index) => ({
        id: `${file.name}-${Date.now()}`,
        file,
        url: URL.createObjectURL(file),
      }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemove = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = images.findIndex((i) => i.id === active.id);
      const newIndex = images.findIndex((i) => i.id === over.id);
      setImages((imgs) => arrayMove(imgs, oldIndex, newIndex));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const timestamp = new Date().toISOString(); // 先定義 timestamp

    const data = {
      userId,
      type,
      content,
      images: images.map((img) => img.url),
      timestamp, // 使用同一個時間
      status: "pending",
      messages: [
        {
          role: "user",
          text: content,
          timestamp,
        },
        {
          role: "bot",
          text: t("complaint.defaultBotMsg"),
          timestamp,
        },
      ],
    };

    await axios.post(`${API_URL}/feedbacks`, data);
    alert(t("complaint.submitSuccess"));

    setType("");
    setContent("");
    setImages([]);
    setIsFormOpen(false);

    const res = await axios.get(`${API_URL}/feedbacks?userId=${userId}`);
    setFeedbacks(res.data);
  };

  if (activeFeedback) {
    return (
      <ChatBox
        feedback={activeFeedback}
        onBack={() => setActiveFeedback(null)}
      />
    );
  }

  if (!isFormOpen) {
    return (
      <div className="complaint-form">
        <button onClick={() => navigate(-1)} className="btn--back">
          ← {t("complaint.back")}
        </button>
        <h3 className="complaint-form__title">{t("complaint.title")}</h3>
        <div className="complaint-form__header">
          <h4 className="complaint-form__subtitle">
            {t("complaint.subtitle1")}
          </h4>
          <button className="btn--edit" onClick={() => setIsFormOpen(true)}>
            ✎
          </button>
        </div>
        {feedbacks.map((fb) => (
          <div
            key={fb.id}
            className="feedback-item"
            onClick={() => setActiveFeedback(fb)}
          >
            <div className="feedback-item__date">
              {new Date(fb.timestamp).toLocaleString()}
            </div>
            <div className="feedback-item__content">{fb.content}</div>
            <div>
              <span className="feedback-item__type">
                {" "}
                {t(`complaint.${fb.type}`)}
              </span>
              <span className={`feedback-item__status ${fb.status}`}>
                {fb.status === "processed"
                  ? t("complaint.processed")
                  : fb.status === "processing"
                  ? t("complaint.processing")
                  : t("complaint.pending")}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="complaint-form__new">
      <button onClick={() => navigate(-1)} className="btn--back">
        ← {t("complaint.back")}
      </button>
      <h3 className="complaint-form__title">{t("complaint.title")}</h3>
      <div className="complaint-form__form">
        <label className="question-title">{t("complaint.subtitle2")}</label>
        <select
          className="question-types"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option className="question-default" value="">
            {t("complaint.defaultSelector")}
          </option>
          <option className="question-type" value="recharge">
            {t("complaint.recharge")}
          </option>
          <option className="question-type" value="function">
            {t("complaint.function")}
          </option>
          <option className="question-type" value="game">
            {t("complaint.game")}
          </option>
          <option className="question-type" value="other">
            {t("complaint.other")}
          </option>
        </select>
      </div>

      <div className="complaint-form__form content">
        <label className="question-title">{t("complaint.subtitle3")}</label>
        <textarea
          placeholder={t("complaint.placeholderQues")}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
          className="question-content"
        ></textarea>
      </div>

      <div className="complaint-form__form content">
        <label className="question-title">{t("complaint.upload")}</label>

        {/* 隱藏檔案 input */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          disabled={images.length >= MAX_FILES}
          ref={fileInputRef}
          style={{ display: "none" }}
        />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((img) => img.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="sortable-images">
              {/* 現有圖片 */}
              {images.map((img) => (
                <SortableImage
                  key={img.id}
                  id={img.id}
                  url={img.url}
                  onRemove={() => handleRemove(img.id)}
                  onClick={setLightbox}
                />
              ))}

              {/* 上傳按鈕，最多 5 張 */}
              {images.length < MAX_FILES && (
                <div
                  className={`upload-area ${isDragging ? "drag-hover" : ""}`}
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={(e) => {
                    e.preventDefault(); // 總是先擋預設行為
                    if (!e.dataTransfer.types.includes("Files")) return;
                  }}
                  onDragEnter={() => setIsDragging(true)}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    handleDrop(e);
                    setIsDragging(false);
                  }}
                >
                  {isUploading ? <LoadingSmall /> : "+"}
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <button type="submit" className="btn--submit">
        {t("complaint.submit")}
      </button>

      {createPortal(
        <AnimatePresence>
          {lightbox && (
            <motion.div
              className="lightbox--contact"
              onClick={() => setLightbox(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img
                key={lightbox}
                src={lightbox}
                alt="lightbox"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </form>
  );
};

export default ComplaintForm;
