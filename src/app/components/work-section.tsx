import { motion, useScroll, useTransform } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { useRef, useState } from 'react';
import ProjectModal from './project-modal';

const projects = [
  {
    id: 1,
    title: 'YOUNG MI',
    category: 'Character Series',
    year: '2022',
    image: 'https://pbs.twimg.com/media/GdN7WSoXQAAgQO0?format=jpg&name=large',
    images: [
      'https://pbs.twimg.com/media/GUkhZdYXMAAW-54?format=jpg&name=small',
      'https://pbs.twimg.com/media/GdN7WSoXQAAgQO0?format=jpg&name=large',
      'https://pbs.twimg.com/media/GUkhZdaXwAAdhCY?format=jpg&name=small',
      'https://pbs.twimg.com/media/GVyCuqXXMAAj73g?format=jpg&name=small',
      'https://pbs.twimg.com/media/GWak2uBXAAELrGP?format=jpg&name=medium',
    ],
  },
  {
    id: 2,
    title: 'PINK ARMY',
    category: 'AI Influencer',
    year: '2022',
    image: 'https://github.com/madbak98/My-image/blob/main/07c36aee-e7ba-456f-bb91-bb238e60cbf1.png?raw=true',
    images: [
      'https://github.com/madbak98/My-image/blob/main/6fe54cd9-9cce-492c-ba0c-e6438d486fff.png?raw=true',
      'https://github.com/madbak98/My-image/blob/main/hf_20260218_004459_b98c0ec6-0c6a-4a90-a28a-beb3712647cc.png?raw=true',
      'https://github.com/madbak98/My-image/blob/main/hf_20260218_000747_13e6678b-ebae-4047-a96d-57a325ebbf6f.png?raw=true',
      'https://github.com/madbak98/My-image/blob/main/hf_20260218_000558_d245cf16-18d6-49a3-a994-a4a524d5049e.png?raw=true',
      'https://github.com/madbak98/My-image/blob/main/07c36aee-e7ba-456f-bb91-bb238e60cbf1.png?raw=true',
    ],
  },
  {
    id: 3,
    title: 'ETHEREAL BEINGS',
    category: 'Cover Art',
    year: '2025',
    image: 'https://github.com/madbak98/My-image/blob/main/Gemini_Generated_Image_v6xqw8v6xqw8v6xq.png?raw=true',
    images: [
      'https://github.com/madbak98/My-image/blob/main/Gemini_Generated_Image_v6xqw8v6xqw8v6xq.png?raw=true',
      'https://github.com/madbak98/My-image/blob/main/Gemini_Generated_Image_ovdyb1ovdyb1ovdy.jpg?raw=true',
      'https://github.com/madbak98/My-image/blob/main/IMG_3225.JPG?raw=true',
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
      'https://pbs.twimg.com/media/GbZR4wrbQAAAtSn?format=jpg&name=medium',
      'https://pbs.twimg.com/media/GbZStxTbAAAydlE?format=jpg&name=medium',
      'https://pbs.twimg.com/media/GbZR4wpaIAA3Ino?format=jpg&name=medium',
      'https://pbs.twimg.com/media/GbZStxQawAA56hR?format=jpg&name=medium',
      'https://pbs.twimg.com/media/GbZR4wtbgAA92kW?format=jpg&name=medium',
    ],
  },
  {
    id: 5,
    title: 'URBAN LEGENDS',
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

function FeaturedProject({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (project: Project) => void;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-120px' }}
      onClick={() => onOpen(project)}
      className="group block w-full text-left"
    >
      <div className="overflow-hidden border" style={{ borderColor: 'rgba(var(--foreground-rgb), 0.12)' }}>
        <div className="relative aspect-[16/9] overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${project.image})` }}
            whileHover={{ scale: 1.045, rotate: 0.6 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(var(--background-rgb), 0.06) 0%, rgba(var(--background-rgb), 0.18) 34%, rgba(var(--background-rgb), 0.84) 100%)',
            }}
          />
          <div className="absolute inset-x-0 bottom-0 grid gap-5 p-6 lg:grid-cols-12 lg:items-end lg:p-8">
            <div className="lg:col-span-8">
              <p
                className="mb-3 text-[0.72rem]"
                style={{
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.26em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-green)',
                }}
              >
                {project.category} / {project.year}
              </p>
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(3.3rem, 7vw, 6.5rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.06em',
                  lineHeight: 0.82,
                  textTransform: 'uppercase',
                  color: 'var(--main-element)',
                }}
              >
                {project.title}
              </h3>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <span
                className="inline-flex items-center gap-3 border-t pt-3"
                style={{
                  borderColor: 'rgba(var(--foreground-rgb), 0.12)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: 'rgba(var(--foreground-rgb), 0.78)',
                }}
              >
                View project
                <ExternalLink size={14} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.65, delay: index * 0.06, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-80px' }}
      onClick={() => onOpen(project)}
      className="group block w-full text-left"
    >
      <div className="overflow-hidden border" style={{ borderColor: 'rgba(var(--foreground-rgb), 0.1)' }}>
        <div className="relative aspect-[4/5] overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${project.image})` }}
            whileHover={{ scale: 1.055, rotate: 0.75 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(var(--background-rgb), 0.04) 0%, rgba(var(--background-rgb), 0.1) 40%, rgba(var(--background-rgb), 0.82) 100%)',
            }}
          />
        </div>

        <div className="grid gap-5 border-t p-5" style={{ borderColor: 'rgba(var(--foreground-rgb), 0.1)' }}>
          <div className="flex items-start justify-between gap-5">
            <div>
              <p
                className="mb-3 text-[0.68rem]"
                style={{
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-green)',
                }}
              >
                {project.year}
              </p>
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2.1rem, 5vw, 3rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.05em',
                  lineHeight: 0.86,
                  textTransform: 'uppercase',
                  color: 'var(--main-element)',
                }}
              >
                {project.title}
              </h3>
            </div>
            <ExternalLink
              size={16}
              style={{ color: 'rgba(var(--foreground-rgb), 0.42)', flexShrink: 0 }}
            />
          </div>

          <div
            className="border-t pt-3"
            style={{
              borderColor: 'rgba(var(--foreground-rgb), 0.08)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'rgba(var(--foreground-rgb), 0.56)',
            }}
          >
            {project.category}
          </div>
        </div>
      </div>
    </motion.button>
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

  const opacity = useTransform(scrollYProgress, [0, 0.16, 0.84, 1], [0, 1, 1, 0.45]);
  const y = useTransform(scrollYProgress, [0, 0.16, 0.84, 1], [80, 0, 0, -60]);

  const openProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeProject = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const [featuredProject, ...secondaryProjects] = projects;

  return (
    <section
      id="work"
      ref={ref}
      className="relative min-h-[82vh] px-6 py-20 sm:px-10 lg:px-14"
    >
      <motion.div
        className="relative z-10 mx-auto max-w-7xl"
        style={{ opacity, y }}
      >
        <div className="mb-16 grid gap-10 border-t pt-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div
              className="mb-7 inline-flex items-center gap-4"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'var(--accent-green)',
              }}
            >
              <span
                className="h-px w-12"
                style={{ background: 'rgba(var(--secondary-element-rgb), 0.9)' }}
              />
              [002] Selected work
            </div>

            <h2
              className="heading-glitch"
              data-text="Portfolio"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(4.4rem, 11vw, 9rem)',
                fontWeight: 800,
                letterSpacing: '-0.07em',
                lineHeight: 0.8,
                textTransform: 'uppercase',
                color: 'var(--main-element)',
              }}
            >
              Portfolio
            </h2>
          </div>

          <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.02rem',
                fontWeight: 300,
                letterSpacing: '0.06em',
                lineHeight: 1.7,
                color: 'rgba(var(--foreground-rgb), 0.58)',
              }}
            >
              A tightly curated selection of design worlds, visual campaigns and
              presentation-led projects. Strong imagery first, language second.
            </p>
          </div>
        </div>

        <div className="grid gap-8">
          <FeaturedProject project={featuredProject} onOpen={openProject} />

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {secondaryProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onOpen={openProject}
              />
            ))}
          </div>
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
