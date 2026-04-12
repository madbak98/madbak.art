import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState } from 'react';

const nftCollections = [
  {
    id: 1,
    title: 'Puffer Hustler',
    supply: '1/1',
    platform: 'Foundation',
    link: 'https://foundation.app/mint/base/0xA19ec1c9b7d4380CcB94f2B4eCBC1af51C485577/8',
    image: 'https://ipfs.foundation.app/ipfs/QmSawSnoD6YG6jP1ot8WhoZFcaS12tjE587y9QSJK2F1XD/nft.jpg',
  },
  {
    id: 2,
    title: 'Labubu Boi',
    supply: '1/1',
    platform: 'Foundation',
    link: 'https://foundation.app/mint/base/0xA19ec1c9b7d4380CcB94f2B4eCBC1af51C485577/3',
    image: 'https://ipfs.foundation.app/ipfs/QmUq7LLGzhKSrLePeYu5iR2XdTWZPsaPzWWQGUkNj9fbNb/nft.png',
  },
  {
    id: 3,
    title: 'Court Phantom',
    supply: '1/1',
    platform: 'Foundation',
    link: 'https://foundation.app/mint/base/0xA19ec1c9b7d4380CcB94f2B4eCBC1af51C485577/26',
    image: 'https://ipfs.foundation.app/ipfs/QmRomE5hbmiPUaRz8Yuqd7Mi9kDGrA93MkeEaCQdLu6icM/nft.jpg',
  },
  {
    id: 4,
    title: 'Matcha Hood',
    supply: '1/1',
    platform: 'Foundation',
    link: 'https://foundation.app/mint/base/0xA19ec1c9b7d4380CcB94f2B4eCBC1af51C485577/4',
    image: 'https://ipfs.foundation.app/ipfs/QmZKuxDhcmrFMmLGnjrELXF4y6sFvjjvL6jHZ8M22CkkNX/nft.png',
  },
  {
    id: 5,
    title: 'Snack Bandit',
    supply: '1/1',
    platform: 'Foundation',
    link: 'https://foundation.app/mint/base/0xA19ec1c9b7d4380CcB94f2B4eCBC1af51C485577/9',
    image: 'https://ipfs.foundation.app/ipfs/QmZRGEXyzMW5uZVM9whZ34R8TizGWL4hN7yeajxnk12djG/nft.png',
  },
  {
    id: 6,
    title: 'Gummy Shooter',
    supply: '1/1',
    platform: 'Foundation',
    link: 'https://foundation.app/mint/base/0xA19ec1c9b7d4380CcB94f2B4eCBC1af51C485577/11',
    image: 'https://ipfs.foundation.app/ipfs/QmTafSoJ8Hj754nkiNZ7rEYHT4uiRdkJPmvGJkiYQTRwiC/nft.jpg',
  },
];

function NFTCard({ nft, index }: { nft: typeof nftCollections[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={nft.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      viewport={{ once: true, margin: '-50px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group cursor-pointer overflow-hidden"
      style={{ aspectRatio: '1/1' }}
    >
      {/* Image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${nft.image})`,
        }}
        animate={{ 
          scale: isHovered ? 1.15 : 1,
        }}
        transition={{ duration: 0.8 }}
      />

      {/* Overlay */}
      <motion.div 
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(var(--foreground-rgb), 0.9) 0%, transparent 40%)',
        }}
        animate={{
          opacity: isHovered ? 1 : 0.7,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        {/* Platform Badge */}
        <motion.div
          className="self-start px-3 py-1"
          style={{
            backgroundColor: 'rgba(var(--main-element-rgb), 0.22)',
            border: '1px solid var(--accent-green)',
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : -10,
          }}
          transition={{ duration: 0.3 }}
        >
          <span 
            className="text-xs tracking-[0.15em] uppercase"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}
          >
            {nft.platform}
          </span>
        </motion.div>

        {/* Bottom Info */}
        <div>
          <h3
            className="mb-2"
            style={{ 
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.01em',
              color: 'var(--background)',
            }}
          >
            {nft.title}
          </h3>
          <p 
            className="text-xs tracking-[0.15em] uppercase"
            style={{ 
              fontFamily: 'var(--font-body)',
              color: 'rgba(var(--background-rgb), 0.82)',
            }}
          >
            Supply: {nft.supply}
          </p>
        </div>
      </div>

      {/* Accent border on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ border: '2px solid var(--accent-green)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.a>
  );
}

export function NFTSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.5]);

  return (
    <section 
      id="nft"
      ref={ref}
      className="relative min-h-screen py-32 px-4"
    >
      <motion.div 
        style={{ opacity }}
        className="max-w-7xl mx-auto z-10"
      >
        {/* Header */}
        <div className="mb-20">
          <div className="mb-6">
            <span 
              className="text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}
            >
              [003] NFT COLLECTIONS
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
            ON-CHAIN<br />ART
          </h2>
          <p 
            className="mt-6 max-w-2xl text-sm tracking-[0.15em] uppercase"
            style={{ 
              fontFamily: 'var(--font-body)',
              color: 'rgba(var(--foreground-rgb), 0.7)',
            }}
          >
            Explore my NFT collections living on the blockchain. 
            Each piece is a unique digital artifact.
          </p>
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nftCollections.map((nft, index) => (
            <NFTCard key={nft.id} nft={nft} index={index} />
          ))}
        </div>

        {/* Platform Links */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap gap-6 justify-center"
        >
          
          <a
            href="https://foundation.app/@madbak?username=Madbak"
            target="_blank"
            rel="noopener noreferrer"
            className="group px-8 py-4 border-2 transition-all duration-300"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              borderColor: 'var(--accent-green)',
              color: 'var(--foreground)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--main-element)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            View on Foundation
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
