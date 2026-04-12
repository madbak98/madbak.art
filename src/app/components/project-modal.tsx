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
        position: 'fixed',
        inset: 0,
        background: 'rgba(var(--foreground-rgb), 0.42)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        padding: '24px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--background)',
          color: 'var(--foreground)',
          width: '100%',
          maxWidth: '1100px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '16px',
          padding: '24px',
          position: 'relative',
          boxShadow: '0 24px 60px rgba(var(--foreground-rgb), 0.18)',
          border: '1px solid rgba(var(--foreground-rgb), 0.14)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: '1px solid rgba(var(--foreground-rgb), 0.28)',
            color: 'var(--foreground)',
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
          }}
        >
          Close
        </button>

        <h2>{project.title}</h2>
        <p>{project.category}</p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
          }}
        >
          {project.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${project.title} ${index + 1}`}
              style={{
                width: '100%',
                borderRadius: '12px',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
          }}
        >
          {project.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${project.title} ${index + 1}`}
              style={{
                width: '100%',
                borderRadius: '12px',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
