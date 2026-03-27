import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import ProjectModal from '../../../components/project-modal';
const projects = [
  {
    id: 1,
    title: 'YOUNG MI',
    category: 'Character Series',
    year: '2024',
    image: 'https://pbs.twimg.com/media/GdN7WSoXQAAgQO0?format=jpg&name=large',
    images: [
      'https://pbs.twimg.com/media/GdN7WSoXQAAgQO0?format=jpg&name=large',
      'https://pbs.twimg.com/media/GdN7WSoXQAAgQO0?format=jpg&name=large',
      'https://pbs.twimg.com/media/GdN7WSoXQAAgQO0?format=jpg&name=large',
    ],
  },
  {
    id: 2,
    title: 'PINK ARMY',
    category: 'AI Influencer',
    year: '2022',
    image: 'https://pbs.twimg.com/media/HEWbhH1bYAcMjdI?format=jpg&name=medium',
    images: [
      'https://pbs.twimg.com/media/HEWbhH1bYAcMjdI?format=jpg&name=medium',
      'https://pbs.twimg.com/media/HEWbhH1bYAcMjdI?format=jpg&name=medium',
      'https://pbs.twimg.com/media/HEWbhH1bYAcMjdI?format=jpg&name=medium',
    ],
  },
  {
    id: 3,
    title: 'ETHEREAL BEINGS',
    category: 'Cover Art',
    year: '2025',
    image: 'https://pbs.twimg.com/media/HEWcDx9WkAA2AN6?format=jpg&name=medium',
    images: [
      'https://pbs.twimg.com/media/HEWcDx9WkAA2AN6?format=jpg&name=medium',
      'https://pbs.twimg.com/media/HEWcDx9WkAA2AN6?format=jpg&name=medium',
      'https://pbs.twimg.com/media/HEWcDx9WkAA2AN6?format=jpg&name=medium',
    ],
  },
  {
    id: 4,
    title: 'BATMAN X LV',
    category: 'Concept Design',
    year: '2023',
    image: 'https://pbs.twimg.com/media/GbZStxSbIAEgwHH?format=jpg&name=large',
    images: [
      'https://pbs.twimg.com/media/GbZStxSbIAEgwHH?format=jpg&name=large',
      'https://pbs.twimg.com/media/GbZStxSbIAEgwHH?format=jpg&name=large',
      'https://pbs.twimg.com/media/GbZStxSbIAEgwHH?format=jpg&name=large',
    ],
  },
  {
    id: 5,
    title: 'URBAN LEGENDS',
    category: 'Pixel Art',
    year: '2021',
    image: 'https://pbs.twimg.com/media/GT3NgmXW4AAK0cW?format=jpg&name=medium',
    images: [
      'https://pbs.twimg.com/media/GT3NgmXW4AAK0cW?format=jpg&name=medium',
      'https://pbs.twimg.com/media/GT3NgmXW4AAK0cW?format=jpg&name=medium',
      'https://pbs.twimg.com/media/GT3NgmXW4AAK0cW?format=jpg&name=medium',
    ],
  },
  {
    id: 6,
    title: 'KING JAMES',
    category: 'Poster',
    year: '2023',
    image: 'https://withered-field-589.linkyhost.com',
    images: [
      'https://withered-field-589.linkyhost.com',
      'https://withered-field-589.linkyhost.com',
      'https://withered-field-589.linkyhost.com',
    ],
  },
];

type Project = (typeof projects)[0];

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true, margin: '-100px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group cursor-pointer overflow-hidden"
      style={{ aspectRatio: '3/4' }}
    >
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${project.image})`,
        }}
        animate={{
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.6 }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(10, 10, 10, 0.95) 0%, transparent 50%, rgba(10, 10, 10, 0.7) 100%)',
        }}
      />

      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -20 }}
          transition={{ duration: 0.3 }}
        >
          <span
            className="text-xs tracking-[0.2em] uppercase"
            style={{ fontFamily: 'var(--font-mono)', color: '#E62525' }}
          >
            {project.year}
          </span>
        </motion.div>

        <div>
          <motion.div
            animate={{ y: isHovered ? -10 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3
              className="mb-2"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                fontWeight: 800,
                letterSpacing: '-0.01em',
                color: '#F5F5F5',
              }}
            >
              {project.title}
            </h3>
            <p
              className="text-xs tracking-[0.15em] uppercase mb-4"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'rgba(245, 245, 245, 0.7)',
              }}
            >
              {project.category}
            </p>
          </motion.div>

          <motion.button
            type="button"
            onClick={() => onOpen(project)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center gap-2"
            style={{
              color: '#E62525',
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <span
              className="text-xs tracking-[0.15em] uppercase"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              View Project
            </span>
            <ExternalLink size={14} />
          </motion.button>
        </div>
      </div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ border: '2px solid #E62525' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

export function WorkSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.5]);

  const openProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeProject = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <section
      id="work"
      ref={ref}
      className="relative min-h-screen py-32 px-4"
    >
      <motion.div
        style={{ opacity }}
        className="max-w-7xl mx-auto z-10"
      >
        <div className="mb-20">
          <div className="mb-6">
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: 'var(--font-mono)', color: '#E62525' }}
            >
              [002] SELECTED WORK
            </span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#F5F5F5',
            }}
          >
            PORTFOLIO
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={openProject}
            />
          ))}
        </div>
      </motion.div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={closeProject}
        project={selectedProject}
      />
    </section>
  );
}
