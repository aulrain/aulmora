import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Component as EtheralShadow } from './components/ui/etheral-shadow';
import { FloatingPaths } from './components/ui/background-paths';

export default function App() {
  const [isMobileOrTouch, setIsMobileOrTouch] = useState(false);
  const { scrollY } = useScroll();
  
  // Smooth scroll values for premium feel
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });
  
  // Move paths vertically based on scroll to create parallax
  // Using a smaller range to prevent paths from cutting off
  const y1 = useTransform(smoothScrollY, [0, 5000], [0, 250]);
  const y2 = useTransform(smoothScrollY, [0, 5000], [0, -250]);

  useEffect(() => {
    const checkViewport = () => {
      const isTouch = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobileOrTouch(window.innerWidth <= 768 || isTouch);
    };
    
    // Initial check
    checkViewport();
    
    // Listen for resize
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  return (
    <div className="w-full h-screen fixed inset-0 pointer-events-none" style={{ zIndex: 0, backgroundColor: '#0A0A0A' }}>
      {isMobileOrTouch ? (
        <div 
          className="absolute inset-0" 
          style={{ background: 'radial-gradient(ellipse at center, rgba(180, 155, 70, 0.08) 0%, transparent 70%)' }}>
        </div>
      ) : (
        <EtheralShadow
          color="rgba(212, 175, 55, 0.5)"
          animation={{ 
            scale: 40, 
            speed: 85 
          }}
          noise={{ opacity: 0.2, scale: 1.5 }}
          sizing="stretch"
        />
      )}
      
      {/* Floating Paths Background */}
      <div className="absolute inset-0 z-[1] opacity-90 overflow-hidden" style={{ mixBlendMode: 'screen', willChange: 'transform' }}>
        <motion.div style={{ y: isMobileOrTouch ? 0 : y1, scale: 1.5 }} className="absolute inset-0">
          <FloatingPaths position={1} />
        </motion.div>
        <motion.div style={{ y: isMobileOrTouch ? 0 : y2, scale: 1.5 }} className="absolute inset-0">
          <FloatingPaths position={-1} />
        </motion.div>
      </div>

      {/* Dark overlay on top of shadow but below content */}
      <div 
        className="fixed inset-0 pointer-events-none" 
        style={{ backgroundColor: 'rgba(10, 10, 10, 0.5)', zIndex: 2 }}
      ></div>
    </div>
  );
}
