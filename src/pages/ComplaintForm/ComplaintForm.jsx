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
import axios from "axios";
import "./ComplaintForm.scss";

const MAX_FILES = 5;
const API_URL = "http://localhost:5000";

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
      <img
        src={url}
        alt="preview"
        onClick={() => onClick(url)}
        {...listeners}
      />
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
        id: `${Date.now()}-${index}`,
        file,
        url: URL.createObjectURL(file),
      }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    const newImages = files
      .slice(0, MAX_FILES - images.length)
      .map((file, index) => ({
        id: `${Date.now()}-${index}`,
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
    const data = {
      userId,
      type,
      content,
      images: images.map((img) => img.url),
      timestamp: new Date().toISOString(),
      status: "未處理",
    };
    await axios.post(`${API_URL}/feedbacks`, data);
    alert("提交成功！");
    setIsFormOpen(false);
    const res = await axios.get(`${API_URL}/feedbacks?userId=${userId}`);
    setFeedbacks(res.data);
  };

  if (!isFormOpen) {
    return (
      <div className="complaint-form">
        <h3 className="complaint-form__title">聯繫客服</h3>
        <div className="complaint-form__header">
          <h4 className="complaint-form__subtitle">問題反饋</h4>
          <button className="btn--edit" onClick={() => setIsFormOpen(true)}>
            ✎
          </button>
        </div>
        {feedbacks.map((fb) => (
          <div key={fb.id} className="feedback-item">
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
      <h3 className="complaint-form__title">聯繫客服</h3>
      <div className="complaint-form__form">
        <label className="question-title">問題類型</label>
        <select
          className="question-types"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option className="qusetion-default" value="">
            請選擇問題類型
          </option>
          <option className="question-type" value={t("complaint.recharge")}>
            {t("complaint.recharge")}
          </option>
          <option className="question-type" value={t("complaint.function")}>
            {t("complaint.function")}
          </option>
          <option className="question-type" value={t("complaint.game")}>
            {t("complaint.game")}
          </option>
          <option className="question-type" value={t("complaint.other")}>
            {t("complaint.other")}
          </option>
        </select>
      </div>

      <div className="complaint-form__form content">
        <label className="question-title">您的問題</label>
        <textarea
          placeholder="請說明你的問題"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
          className="question-content"
        ></textarea>
      </div>

      <div className="complaint-form__form content">
        <label className="question-title">上傳憑證（最多5張圖片）</label>

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
                  className="upload-area"
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  +
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <button type="submit" style={{ marginTop: "1rem" }}>
        提交
      </button>

      {lightbox &&
        createPortal(
          <div
            onClick={() => setLightbox(null)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <img
              src={lightbox}
              alt="lightbox"
              style={{
                maxHeight: "90%",
                maxWidth: "90%",
                objectFit: "contain",
              }}
            />
          </div>,
          document.body
        )}
    </form>
  );
};

export default ComplaintForm;
