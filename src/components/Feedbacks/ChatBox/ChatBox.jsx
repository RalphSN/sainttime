import { useEffect, useRef, useState } from "react";
import axios from "axios";
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
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import SortableImage from "../../Shared/SortableImage/SortableImage";
import LoadingSmall from "../../Loading/LoadingSmall";
import "./ChatBox.scss";
import "../../../scss/common.scss";

const API_URL = import.meta.env.VITE_API_URL;
const MAX_FILES = 5;

const ChatBox = ({ feedback, onBack }) => {
  const [messages, setMessages] = useState(feedback.messages || []);
  const [inputText, setInputText] = useState("");
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (feedback.images?.length > 0) {
      const initialImages = feedback.images.map((url, index) => ({
        id: `existing-${index}-${Date.now()}`,
        file: null,
        url,
        uploaded: true,
      }));
      setImages(initialImages);
    }
  }, [feedback.images]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.slice(0, MAX_FILES - images.length).map((file) => ({
      id: `${file.name}-${Date.now()}`,
      file,
      url: URL.createObjectURL(file),
      uploaded: false,
    }));
    setImages((prev) => [...prev, ...newImages]);
    fileInputRef.current.value = null;
  };

  const handleRemove = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const items = Array.from(e.dataTransfer.items);
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
      .map((file) => ({
        id: `${file.name}-${Date.now()}`,
        file,
        url: URL.createObjectURL(file),
        uploaded: false,
      }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = images.findIndex((i) => i.id === active.id);
      const newIndex = images.findIndex((i) => i.id === over.id);
      const newOrder = arrayMove(images, oldIndex, newIndex);
      setImages(newOrder);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() && images.length === 0) return;

    const newMessage = {
      role: "user",
      text: inputText.trim(),
      images: images.map((img) => img.url),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputText("");

    try {
      await axios.patch(`${API_URL}/feedbacks/${feedback.id}`, {
        messages: updatedMessages,
        images: images.map((img) => img.url),
      });

      setImages((prev) => prev.map((img) => ({ ...img, uploaded: true })));
    } catch (err) {
      alert("訊息儲存失敗！");
    }
  };

  return (
    <div className="chat-box">
      <button onClick={onBack} className="btn--back">
        ← 返回
      </button>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role}`}>
            <div className="chat-message__text">{msg.text}</div>
            {msg.images?.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="chat-img"
                className="chat-message__image"
              />
            ))}
            <div className="chat-message__time">
              {new Date(msg.timestamp).toLocaleString("zh-TW", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      <div className="chat-form__form content">
        <label className="question-title">上傳圖片（最多5張）</label>

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
              {images.map((img) => (
                <SortableImage
                  key={img.id}
                  id={img.id}
                  url={img.url}
                  uploaded={img.uploaded}
                  onRemove={() => handleRemove(img.id)}
                  onClick={() => setLightbox(img.url)}
                />
              ))}

              {images.length < MAX_FILES && (
                <div
                  className={`upload-area ${isDragging ? "drag-hover" : ""}`}
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
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

      {lightbox && (
        <AnimatePresence>
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
        </AnimatePresence>
      )}

      <div className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="輸入訊息..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="btn--send" onClick={handleSend}>
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
