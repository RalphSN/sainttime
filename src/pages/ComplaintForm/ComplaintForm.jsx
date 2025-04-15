import { useState, useRef, useEffect } from "react";
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
    position: "relative",
    width: 100,
    height: 100,
    border: "1px solid #ccc",
    borderRadius: "8px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <img
        src={url}
        alt="preview"
        style={{ cursor: "pointer", maxWidth: "100%", maxHeight: "100%" }}
        onClick={() => onClick(url)}
      />
      <button
        type="button"
        onClick={onRemove}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          background: "red",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        X
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4 className="complaint-form__subtitle">問題反饋</h4>
          <button
            className="btn--edit"
            onClick={() => setIsFormOpen(true)}
          >
            ✎
          </button>
        </div>
        {feedbacks.map((fb) => (
          <div
            key={fb.id}
            style={{
              border: "1px solid #999",
              borderRadius: 8,
              padding: 10,
              marginBottom: 10,
            }}
          >
            <div>{new Date(fb.timestamp).toLocaleString()}</div>
            <div>{fb.content}</div>
            <div>
              <span
                style={{
                  background: "#d0bba0",
                  padding: "2px 6px",
                  borderRadius: 5,
                }}
              >
                {fb.type}
              </span>
              <span
                style={{
                  background: "#4caf50",
                  padding: "2px 6px",
                  borderRadius: 5,
                  marginLeft: 5,
                  color: "#fff",
                }}
              >
                {fb.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ color: "#fff" }}>
      <div>
        <label>問題類型：</label>
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="">請選擇問題類型</option>
          <option value="充值問題">充值問題</option>
          <option value="操作問題">操作問題</option>
          <option value="其他">其他</option>
        </select>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>您的問題：</label>
        <textarea
          placeholder="請說明你的問題"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
          style={{ width: "100%" }}
        ></textarea>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>上傳憑證（最多5張圖片）：</label>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          style={{
            width: 100,
            height: 100,
            border: "1px dashed #888",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            cursor: "pointer",
            marginTop: 8,
          }}
        >
          +
        </div>
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
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "1rem",
              }}
            >
              {images.map((img) => (
                <SortableImage
                  key={img.id}
                  id={img.id}
                  url={img.url}
                  onRemove={() => handleRemove(img.id)}
                  onClick={setLightbox}
                />
              ))}
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
