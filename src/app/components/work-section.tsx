import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const x = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [-100, 0, 0, 100]);

  return (
    <section
      id="about"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center py-32 px-4"
    >
      <motion.div style={{ opacity, x }} className="max-w-4xl z-10">
        <div className="mb-6">
          <span
            className="text-xs tracking-[0.3em] uppercase"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}
          >
            [001] ABOUT
          </span>
        </div>

        <h2
          className="mb-12"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--foreground)',
          }}
        >
          CRAFTING
          <br />
          DIGITAL LEGENDS
        </h2>

        <div className="space-y-6" style={{ fontFamily: 'var(--font-body)' }}>
          <p
            className="text-base leading-relaxed tracking-wide uppercase"
            style={{ color: 'rgba(var(--foreground-rgb), 0.82)' }}
          >
            I’m a curious <span className="font-bold italic">video editor</span> and{' '}
            <span className="font-bold">graphic designer</span> who sees every project
            as a new adventure. Whether I’m crafting a dynamic edit or designing a
            brand’s visual identity, I’m driven by a desire to create content that
            feels fresh, striking and impactful. Off-screen, you’ll find me diving
            into digital art communities, experimenting with new tools and chasing
            inspiration in the city’s vibrant culture.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {[
            { value: '80+', label: 'CHARACTERS' },
            { value: '2', label: 'COLLECTIONS' },
            { value: '50+', label: 'HOLDERS' },
            { value: '5+', label: 'YEARS EXP' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border-l-2 pl-4"
              style={{ borderColor: 'var(--accent-green)' }}
            >
              <div
                className="text-4xl mb-2"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  color: 'var(--main-element)',
                }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs tracking-[0.2em] uppercase"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'rgba(var(--foreground-rgb), 0.62)',
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
    category: 'Pixel Art',
    year: '2021',
    image: 'https://pbs.twimg.com/media/GT3NgmXW4AAK0cW?format=jpg&name=medium',
    images: [
      'https://pbs.twimg.com/media/GQCNpfGWkAAuj_t?format=jpg&name=medium',
      'https://pbs.twimg.com/media/GQCOgSqWYAA_rP5?format=jpg&name=medium',
      'https://pbs.twimg.com/media/GQCaGcdXoAAxOBQ?format=jpg&name=medium',
    ],
  },
  {
    id: 6,
    title: 'BACKTALK',
    category: 'Poster',
    year: '2023',
    image: 'https://github.com/madbak98/My-image/blob/main/A71CBD71-2336-4019-AB4E-65A920E28D27.PNG?raw=true',
    images: [
      'https://withered-field-589.linkyhost.com',
      'https://pbs.twimg.com/media/GT_QPtuX0AAEdB9?format=jpg&name=medium',
      'https://pbs.twimg.com/media/GStY8XGX0AAdgpR?format=jpg&name=medium',
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
            'linear-gradient(to top, rgba(var(--foreground-rgb), 0.92) 0%, transparent 50%, rgba(var(--foreground-rgb), 0.48) 100%)',
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
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}
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
                color: 'var(--background)',
              }}
            >
              {project.title}
            </h3>
            <p
              className="text-xs tracking-[0.15em] uppercase mb-4"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'rgba(var(--background-rgb), 0.78)',
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
              color: 'var(--main-element)',
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
        style={{ border: '2px solid var(--accent-green)' }}
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
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}
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
              color: 'var(--foreground)',
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
    images: [
      'https://pbs.twimg.com/media/GQCNpfGWkAAuj_t?format=jpg&name=medium',
      'https://pbs.twimg.com/media/GQCOgSqWYAA_rP5?format=jpg&name=medium',
      'https://pbs.twimg.com/media/GQCaGcdXoAAxOBQ?format=jpg&name=medium',
    ],
  },
  {
    id: 6,
    title: 'BACKTALK',
    category: 'Poster',
    year: '2023',
    image: 'https://github.com/madbak98/My-image/blob/main/A71CBD71-2336-4019-AB4E-65A920E28D27.PNG?raw=true',
    images: [
      'https://withered-field-589.linkyhost.com',
      'https://pbs.twimg.com/media/GT_QPtuX0AAEdB9?format=jpg&name=medium',
      'https://pbs.twimg.com/media/GStY8XGX0AAdgpR?format=jpg&name=medium',
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
            'linear-gradient(to top, rgba(var(--foreground-rgb), 0.92) 0%, transparent 50%, rgba(var(--foreground-rgb), 0.48) 100%)',
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
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}
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
                color: 'var(--background)',
              }}
            >
              {project.title}
            </h3>
            <p
              className="text-xs tracking-[0.15em] uppercase mb-4"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'rgba(var(--background-rgb), 0.78)',
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
              color: 'var(--main-element)',
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
        style={{ border: '2px solid var(--accent-green)' }}
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
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}
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
              color: 'var(--foreground)',
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
