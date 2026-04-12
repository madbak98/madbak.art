import { GameSection } from './components/game-section';
import { GridBackground } from './components/grid-background';
import { HeroSection } from './components/hero-section';
import { AboutSection } from './components/about-section';
import { WorkSection } from './components/work-section';
import { NFTSection } from './components/nft-section';
import { ContactSection } from './components/contact-section';

export default function App() {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      <GridBackground />

      <main className="relative z-10">
        <HeroSection />
        <GameSection />
        <AboutSection />
        <WorkSection />
        <NFTSection />
        <ContactSection />
      </main>
    </div>
  );
}
