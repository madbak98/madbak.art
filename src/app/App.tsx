import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { GameSection } from './components/game-section';
import { GridBackground } from './components/grid-background';
import { HeroSection } from './components/hero-section';
import { AboutSection } from './components/about-section';
import { WorkSection } from './components/work-section';
import { NFTSection } from './components/nft-section';
import { ContactSection } from './components/contact-section';
import { LoadingIntro } from './components/loading-intro';
import { SiteToolbar } from './components/site-toolbar';

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = introDone ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [introDone]);

  useEffect(() => {
    if (introDone) return;
    const hardUnlock = window.setTimeout(() => setIntroDone(true), 3200);
    return () => window.clearTimeout(hardUnlock);
  }, [introDone]);

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      <GridBackground />
      <SiteToolbar />

      {!introDone && <LoadingIntro />}

      <motion.main
        className="relative z-10"
        initial={false}
        animate={
          introDone
            ? { opacity: 1, y: 0, filter: 'blur(0px)' }
            : { opacity: 0, y: 16, filter: 'blur(6px)' }
        }
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <HeroSection />
        <GameSection />
        <AboutSection />
        <WorkSection />
        <NFTSection />
        <ContactSection />
      </motion.main>
    </div>
  );
}
