'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';

// Helper for image paths
const getImagePath = (path: string) => {
  // Check if we're in production with basePath
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/ghibli-recipes')) {
    return `/ghibli-recipes${path}`;
  }
  return path;
};

interface DraggableImage {
  id: string;
  src: string;
  alt: string;
  position: { x: number; y: number };
  navigateTo?: string;
}

export default function Home() {
  const router = useRouter();
  const [images, setImages] = useState<DraggableImage[]>(() => {
    // Default positions for SSR - will be updated in useEffect on client
    const centerX = 525;
    const centerY = 325;
    
    return [
      {
        id: 'ghibli-recipe',
        src: '/images/home/ghibli-recipe.png',
        alt: 'Ghibli Recipe',
        position: { x: centerX, y: centerY },
        navigateTo: '/prototypes/ghibli-recipe-box'
      },
      {
        id: 'frog',
        src: '/images/home/frog.png',
        alt: 'Frog',
        position: { x: centerX - 250, y: centerY - 125 }
      },
      {
        id: 'mail',
        src: '/images/home/mail.png',
        alt: 'Mail',
        position: { x: centerX + 200, y: centerY - 100 }
      },
      {
        id: 'pin',
        src: '/images/home/pin.png',
        alt: 'Pin',
        position: { x: centerX - 75, y: centerY + 225 }
      },
      {
        id: 'ipod',
        src: '/images/home/record-player.png',
        alt: 'iPod',
        position: { x: centerX + 150, y: centerY + 150 },
        navigateTo: '/prototypes/ipod-player'
      },
      {
        id: 'bunny',
        src: '/images/home/bunny.png',
        alt: 'Bunny',
        position: { x: centerX - 300, y: centerY + 100 }
      }
    ];
  });
  
  const draggingRef = useRef<{ id: string | null; startPos: { x: number; y: number }; imgPos: { x: number; y: number } }>({
    id: null,
    startPos: { x: 0, y: 0 },
    imgPos: { x: 0, y: 0 }
  });
  const hasDraggedRef = useRef<{ [key: string]: boolean }>({});
  const imagesRef = useRef<DraggableImage[]>(images);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep imagesRef in sync with images state
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    const centerImages = () => {
      if (typeof window !== 'undefined') {
        const imageSize = 150;
        const viewportWidth = window.innerWidth || 1200;
        const viewportHeight = window.innerHeight || 800;
        const centerX = viewportWidth / 2 - imageSize / 2;
        const centerY = viewportHeight / 2 - imageSize / 2;

        // Sizes matching CSS breakpoints
        const isMobile = viewportWidth <= 480;
        const isTablet = viewportWidth > 480 && viewportWidth <= 768;
        const mailSize = isMobile ? 200 : isTablet ? 240 : 300;
        const pinSize = isMobile ? 53 : isTablet ? 64 : 80;
        const pinOffsetX = mailSize * 0.7; // positioned even more to the right
        const pinOffsetY = Math.round(pinSize * 0.15); // even lower, overlapping more with mail
        
        const next = [
          {
            id: 'ghibli-recipe',
            src: getImagePath('/images/home/ghibli-recipe.png'),
            alt: 'Ghibli Recipe',
            position: { x: centerX, y: centerY },
            navigateTo: '/prototypes/ghibli-recipe-box'
          },
          {
            id: 'frog',
            src: getImagePath('/images/home/frog.png'),
            alt: 'Frog',
            position: { x: centerX - 250, y: centerY - 125 }
          },
          {
            id: 'mail',
            src: getImagePath('/images/home/mail.png'),
            alt: 'Mail',
            position: { x: centerX + 200, y: centerY - 100 }
          },
          {
            id: 'ipod',
            src: getImagePath('/images/home/record-player.png'),
            alt: 'iPod',
            position: { x: centerX + 150, y: centerY + 150 },
            navigateTo: '/prototypes/ipod-player'
          },
          {
            id: 'bunny',
            src: getImagePath('/images/home/bunny.png'),
            alt: 'Bunny',
            position: { x: centerX - 300, y: centerY + 100 }
          }
        ] as DraggableImage[];

        // Compute pin position to stick to top of mail
        const mail = next.find(i => i.id === 'mail');
        if (mail) {
          next.push({
            id: 'pin',
            src: getImagePath('/images/home/pin.png'),
            alt: 'Pin',
            position: { x: mail.position.x + pinOffsetX, y: mail.position.y + pinOffsetY }
          });
        }

        setImages(next);
      }
    };
    
    centerImages();
    window.addEventListener('resize', centerImages);
    return () => window.removeEventListener('resize', centerImages);
  }, []);

  const handleMouseDown = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const image = imagesRef.current.find(img => img.id === id);
    if (!image) return;

    // Prevent dragging the pin so it stays stuck to mail
    if (id === 'pin') return;
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startImgX = image.position.x;
    const startImgY = image.position.y;
    const navigateTo = image.navigateTo;
    
    draggingRef.current = {
      id,
      startPos: { x: startX, y: startY },
      imgPos: { x: startImgX, y: startImgY }
    };
    hasDraggedRef.current[id] = false;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (draggingRef.current.id !== id) return;
      
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 5 || hasDraggedRef.current[id]) {
        hasDraggedRef.current[id] = true;
        
        setImages(prev => {
          const updated = prev.map(img =>
            img.id === id
              ? { ...img, position: { x: startImgX + dx, y: startImgY + dy } }
              : img
          );
          // If dragging mail, update pin to stay attached
          if (id === 'mail') {
            const viewportWidth = window.innerWidth || 1200;
            const isMobile = viewportWidth <= 480;
            const isTablet = viewportWidth > 480 && viewportWidth <= 768;
            const mailSize = isMobile ? 200 : isTablet ? 240 : 300;
            const pinSize = isMobile ? 53 : isTablet ? 64 : 80;
            const pinOffsetX = mailSize * 0.7; // positioned even more to the right
            const pinOffsetY = Math.round(pinSize * 0.15); // even lower, overlapping more with mail
            const newMailX = startImgX + dx;
            const newMailY = startImgY + dy;
            return updated.map(img =>
              img.id === 'pin'
                ? { ...img, position: { x: newMailX + pinOffsetX, y: newMailY + pinOffsetY } }
                : img
            );
          }
          return updated;
        });
      }
    };

    const handleMouseUp = () => {
      if (draggingRef.current.id === id) {
        const didDrag = hasDraggedRef.current[id];
        draggingRef.current.id = null;
        
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        
        if (!didDrag && navigateTo) {
          router.push(navigateTo);
        }
        
        hasDraggedRef.current[id] = false;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (id: string, e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.touches[0]) return;
    
    const image = imagesRef.current.find(img => img.id === id);
    if (!image) return;

    // Prevent dragging the pin so it stays stuck to mail
    if (id === 'pin') return;
    
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    const startImgX = image.position.x;
    const startImgY = image.position.y;
    const navigateTo = image.navigateTo;
    
    draggingRef.current = {
      id,
      startPos: { x: startX, y: startY },
      imgPos: { x: startImgX, y: startImgY }
    };
    hasDraggedRef.current[id] = false;
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (!moveEvent.touches[0] || draggingRef.current.id !== id) return;
      
      const touch = moveEvent.touches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 5 || hasDraggedRef.current[id]) {
        hasDraggedRef.current[id] = true;
        
        setImages(prev => {
          const updated = prev.map(img =>
            img.id === id
              ? { ...img, position: { x: startImgX + dx, y: startImgY + dy } }
              : img
          );
          if (id === 'mail') {
            const viewportWidth = window.innerWidth || 1200;
            const isMobile = viewportWidth <= 480;
            const isTablet = viewportWidth > 480 && viewportWidth <= 768;
            const mailSize = isMobile ? 200 : isTablet ? 240 : 300;
            const pinSize = isMobile ? 53 : isTablet ? 64 : 80;
            const pinOffsetX = mailSize * 0.7; // positioned even more to the right
            const pinOffsetY = Math.round(pinSize * 0.15); // even lower, overlapping more with mail
            const newMailX = startImgX + dx;
            const newMailY = startImgY + dy;
            return updated.map(img =>
              img.id === 'pin'
                ? { ...img, position: { x: newMailX + pinOffsetX, y: newMailY + pinOffsetY } }
                : img
            );
          }
          return updated;
        });
      }
    };

    const handleTouchEnd = () => {
      if (draggingRef.current.id === id) {
        const didDrag = hasDraggedRef.current[id];
        draggingRef.current.id = null;
        
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
        
        if (!didDrag && navigateTo) {
          router.push(navigateTo);
        }
        
        hasDraggedRef.current[id] = false;
      }
    };
    
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div ref={containerRef} className={styles.container}>
      {images.map((image) => (
        <div
          key={image.id}
          className={`${styles.draggableImage} ${image.id === 'pin' ? styles.pin : ''} ${image.id === 'frog' ? styles.frog : ''} ${image.id === 'bunny' ? styles.bunny : ''}`}
          style={{ 
            left: `${image.position.x}px`, 
            top: `${image.position.y}px`,
            zIndex: draggingRef.current.id === image.id ? 20 : 10
          }}
          onMouseDown={(e) => handleMouseDown(image.id, e)}
          onTouchStart={(e) => handleTouchStart(image.id, e)}
        >
          <img src={image.src} alt={image.alt} draggable={false} />
        </div>
      ))}
    </div>
  );
}
