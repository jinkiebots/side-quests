'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';

// Helper for image paths
const getImagePath = (path: string) => {
  // Check if we're in production with basePath
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/side-quests')) {
    return `/side-quests${path}`;
  }
  return path;
};

interface DraggableImage {
  id: string;
  src?: string;
  alt?: string;
  text?: string;
  position: { x: number; y: number };
  navigateTo?: string;
}

export default function Home() {
  const router = useRouter();
  const [images, setImages] = useState<DraggableImage[]>(() => {
    // Default positions for SSR - will be updated in useEffect on client
    // Using default desktop positions as fallback
    const centerX = 600;
    const centerY = 400;
    const ghibliSize = 300;
    const frogSize = 200;
    const mailSize = 300;
    const bunnySize = 200;
    const ipodSize = 300;
    const pinSize = 53; // 1.5x smaller than previous 80px
    const spacingX = 250;
    const spacingY = 125;
    const pinOffsetX = mailSize * 0.65;
    const pinOffsetY = pinSize * 0.85;
    
    const mailPos = { x: centerX + spacingX * 0.7 - mailSize / 2, y: centerY - spacingY * 0.7 - mailSize / 2 };
    
    return [
      {
        id: 'ghibli-recipe',
        src: '/images/home/ghibli-recipe.png',
        alt: 'Ghibli Recipe',
        position: { x: centerX - ghibliSize / 2, y: centerY - ghibliSize / 2 },
        navigateTo: '/prototypes/ghibli-recipe-box'
      },
      {
        id: 'frog',
        src: '/images/home/frog.png',
        alt: 'Frog',
        position: { x: centerX - spacingX - frogSize / 2, y: centerY - spacingY - frogSize / 2 }
      },
      {
        id: 'mail',
        src: '/images/home/mail.png',
        alt: 'Mail',
        position: mailPos,
        navigateTo: '/prototypes/sticker-club-wall'
      },
      {
        id: 'ipod',
        src: '/images/home/record-player.png',
        alt: 'iPod',
        position: { x: centerX + spacingX * 0.5 - ipodSize / 2, y: centerY + spacingY * 1.0 - ipodSize / 2 }
      },
      {
        id: 'bunny',
        src: '/images/home/bunny.png',
        alt: 'Bunny',
        position: { x: centerX - spacingX * 1.0 - bunnySize / 2, y: centerY + spacingY * 0.4 - bunnySize / 2 }
      },
      {
        id: 'pin',
        src: '/images/home/pin.png',
        alt: 'Pin',
        position: { x: mailPos.x + pinOffsetX, y: mailPos.y + pinOffsetY }
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

  // Track if we've loaded saved positions to prevent centering from overriding them
  const hasLoadedSavedPositionsRef = useRef(false);
  const isLoadingSavedPositions = useRef(false);
  
  // Fix image src paths on mount to include basePath
  const fixImagePaths = (imgs: DraggableImage[]): DraggableImage[] => {
    return imgs.map(img => {
      let src = img.src;
      if (src) {
        const bare = src.replace(/^\/(side-quests|ghibli-recipes)/, '');
        src = getImagePath(bare);
      }
      const result: DraggableImage = { ...img, src };
      if (img.id === 'ghibli-recipe' && !img.navigateTo) {
        result.navigateTo = '/prototypes/ghibli-recipe-box';
      }
      if (img.id === 'mail' && !img.navigateTo) {
        result.navigateTo = '/prototypes/sticker-club-wall';
      }
      return result;
    });
  };

  // Load saved positions from sessionStorage on mount (run FIRST)
  // sessionStorage persists only for the current tab and resets when tab is closed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      isLoadingSavedPositions.current = true;
      const saved = sessionStorage.getItem('homepageImagePositions');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed) && parsed.length > 0) {
            const updated = fixImagePaths(parsed);
            setImages(updated);
            imagesRef.current = updated;
            hasLoadedSavedPositionsRef.current = true;
            isLoadingSavedPositions.current = false;
            return;
          }
        } catch (e) {
          console.log('Invalid saved positions, using defaults');
        }
      }
      // No saved positions — fix initial image paths for basePath
      setImages(prev => fixImagePaths(prev));
      hasLoadedSavedPositionsRef.current = false;
      isLoadingSavedPositions.current = false;
    }
  }, []);

  // Save positions to localStorage whenever they change (skip first render)
  const isInitialMount = useRef(true);
  useEffect(() => {
    // Skip saving on initial mount or when loading saved positions
    if (isInitialMount.current || isLoadingSavedPositions.current) {
      isInitialMount.current = false;
      return;
    }
    if (typeof window !== 'undefined' && images.length > 0) {
      // Save whenever positions change (after initial load)
      // Using sessionStorage so positions reset when tab is closed
      sessionStorage.setItem('homepageImagePositions', JSON.stringify(images));
    }
  }, [images]);

  useEffect(() => {
    const centerImages = () => {
      if (typeof window !== 'undefined') {
        // NEVER reset positions if we have saved ones (even on resize)
        const saved = sessionStorage.getItem('homepageImagePositions');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed && Array.isArray(parsed) && parsed.length > 0) {
              // Restore saved positions if they exist
              if (hasLoadedSavedPositionsRef.current) {
                return; // Don't reset positions if we have saved ones
              }
            }
          } catch (e) {
            // Invalid saved data, continue with default
          }
        }
        
        const viewportWidth = window.innerWidth || 1200;
        const viewportHeight = window.innerHeight || 800;

        // Sizes matching CSS breakpoints
        const isMobile = viewportWidth <= 480;
        const isTablet = viewportWidth > 480 && viewportWidth <= 768;
        
        // Get actual image sizes
        const ghibliSize = isMobile ? 200 : isTablet ? 240 : 300;
        const frogSize = isMobile ? 133 : isTablet ? 160 : 200;
        const mailSize = isMobile ? 200 : isTablet ? 240 : 300;
        const bunnySize = isMobile ? 133 : isTablet ? 160 : 200;
        const ipodSize = isMobile ? 200 : isTablet ? 240 : 300;
        const pinSize = isMobile ? 35 : isTablet ? 43 : 53;
        
        // Calculate center with proper spacing for mobile
        const centerX = viewportWidth / 2;
        const centerY = viewportHeight / 2;
        
        // Smaller spacing on mobile to ensure all images fit within viewport
        const spacingX = isMobile ? viewportWidth * 0.18 : 250;
        const spacingY = isMobile ? viewportHeight * 0.15 : 125;
        
        const pinOffsetX = mailSize * 0.65;
        const pinOffsetY = pinSize * 0.85;
        
        const next = [
          {
            id: 'ghibli-recipe',
            src: getImagePath('/images/home/ghibli-recipe.png'),
            alt: 'Ghibli Recipe',
            position: { x: centerX - ghibliSize / 2, y: centerY - ghibliSize / 2 },
            navigateTo: '/prototypes/ghibli-recipe-box'
          },
          {
            id: 'frog',
            src: getImagePath('/images/home/frog.png'),
            alt: 'Frog',
            position: { x: centerX - spacingX - frogSize / 2, y: centerY - spacingY - frogSize / 2 }
          },
          {
            id: 'mail',
            src: getImagePath('/images/home/mail.png'),
            alt: 'Mail',
            position: { x: centerX + spacingX * 0.7 - mailSize / 2, y: centerY - spacingY * 0.7 - mailSize / 2 },
            navigateTo: '/prototypes/sticker-club-wall'
          },
          {
            id: 'ipod',
            src: getImagePath('/images/home/record-player.png'),
            alt: 'iPod',
            position: { x: centerX + spacingX * 0.5 - ipodSize / 2, y: centerY + spacingY * 1.0 - ipodSize / 2 }
          },
          {
            id: 'bunny',
            src: getImagePath('/images/home/bunny.png'),
            alt: 'Bunny',
            position: { x: centerX - spacingX * 1.0 - bunnySize / 2, y: centerY + spacingY * 0.4 - bunnySize / 2 }
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
        hasLoadedSavedPositionsRef.current = false; // Mark that we're using default positions
      }
    };
    
    // Only center if we haven't loaded saved positions
    // Give localStorage load effect time to run first
    const timer = setTimeout(() => {
      if (!hasLoadedSavedPositionsRef.current) {
        centerImages();
      }
    }, 100);
    
    const handleResize = () => {
      // On resize, only center if there are no saved positions
      const saved = sessionStorage.getItem('homepageImagePositions');
      if (!saved) {
        centerImages();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
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
            const pinSize = isMobile ? 35 : isTablet ? 43 : 53;
            const pinOffsetX = mailSize * 0.65; // positioned even more to the right
            const pinOffsetY = pinSize * 0.85; // even lower, overlapping more with mail
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
            const pinSize = isMobile ? 35 : isTablet ? 43 : 53;
            const pinOffsetX = mailSize * 0.65; // positioned even more to the right
            const pinOffsetY = pinSize * 0.85; // even lower, overlapping more with mail
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
            zIndex: image.id === 'pin' ? 25 : (draggingRef.current.id === image.id ? 20 : 10)
          }}
          onMouseDown={(e) => handleMouseDown(image.id, e)}
          onTouchStart={(e) => handleTouchStart(image.id, e)}
        >
          {image.text ? (
            <span className={styles.textLabel}>{image.text}</span>
          ) : (
            <img src={image.src} alt={image.alt} draggable={false} />
          )}
        </div>
      ))}
    </div>
  );
}
