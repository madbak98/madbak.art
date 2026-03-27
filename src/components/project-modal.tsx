type ProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    category: string;
    images: string[];
  } | null;
};

export default function ProjectModal({
  isOpen,
  onClose,
  project,
}: ProjectModalProps) {
  if (!isOpen || !project) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        padding: "24px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#111",
          color: "#fff",
          width: "100%",
          maxWidth: "1100px",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "16px",
          padding: "24px",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "transparent",
            border: "1px solid #444",
            color: "#fff",
            borderRadius: "8px",
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          Close
        </button>

        <h2>{project.title}</h2>
        <p>{project.category}</p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          {project.images.map((img, index) => (
            <img
              key={index}
              src={img}
              style={{
                width: "100%",
                borderRadius: "12px",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
