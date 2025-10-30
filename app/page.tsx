'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  const [position, setPosition] = useState(() => {
    if (typeof window !== 'undefined') {
      return {
        x: (window.innerWidth || 1200) / 2 - 150,
        y: (window.innerHeight || 800) / 2 - 150
      };
    }
    return { x: 450, y: 250 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0, imgX: 0, imgY: 0 });
  const hasDragged = useRef(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const centerImage = () => {
      if (typeof window !== 'undefined' && containerRef.current) {
        const imageSize = 300;
        const viewportWidth = window.innerWidth || 1200;
        const viewportHeight = window.innerHeight || 800;
        setPosition({
          x: viewportWidth / 2 - imageSize / 2,
          y: viewportHeight / 2 - imageSize / 2
        });
      }
    };
    
    centerImage();
    window.addEventListener('resize', centerImage);
    return () => window.removeEventListener('resize', centerImage);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!containerRef.current) return;
    
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      imgX: position.x,
      imgY: position.y
    };
    hasDragged.current = false;
    setIsDragging(false);
    
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 5) {
        hasDragged.current = true;
        setIsDragging(true);
        
        const newX = startPos.current.imgX + dx;
        const newY = startPos.current.imgY + dy;
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      if (!hasDragged.current) {
        router.push('/prototypes/ghibli-recipe-box');
      }
      hasDragged.current = false;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.touches[0]) return;
    
    const touch = e.touches[0];
    startPos.current = {
      x: touch.clientX,
      y: touch.clientY,
      imgX: position.x,
      imgY: position.y
    };
    hasDragged.current = false;
    setIsDragging(false);
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      
      const touch = e.touches[0];
      const dx = touch.clientX - startPos.current.x;
      const dy = touch.clientY - startPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 5) {
        hasDragged.current = true;
        setIsDragging(true);
        
        const newX = startPos.current.imgX + dx;
        const newY = startPos.current.imgY + dy;
        setPosition({ x: newX, y: newY });
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      
      if (!hasDragged.current) {
        router.push('/prototypes/ghibli-recipe-box');
      }
      hasDragged.current = false;
    };
    
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <div
        ref={imageRef}
        className={`${styles.draggableImage} ${isDragging ? styles.dragging : ''}`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <img src="/images/home/ghibli-recipe.png" alt="Ghibli Recipe" draggable={false} />
      </div>
    </div>
  );
}
