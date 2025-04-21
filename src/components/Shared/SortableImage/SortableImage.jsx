import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const SortableImage = ({ id, url, uploaded, onRemove, onClick }) => {
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
      <motion.img
        src={url}
        alt="preview"
        onClick={() => onClick?.(url)}
        initial={{ opacity: 0.5, scale: 0.9 }}
        animate={{
          opacity: uploaded ? 1 : 0.6,
          scale: uploaded ? 1 : 0.95,
          filter: uploaded ? "none" : "grayscale(0.6)",
        }}
        transition={{ duration: 0.3 }}
      />
      <div className="drag-handle" {...listeners}>
        ☰
      </div>
      {!uploaded && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
          className="btn--remove"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      )}
    </div>
  );
};

export default SortableImage;
