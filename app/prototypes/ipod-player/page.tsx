'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';

export default function IPodPlayer() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  // Extract video ID from the YouTube URL
  const videoId = '-Uk1LxT6AYg';
  const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1`;

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => router.push('/')}>
        ← Back
      </button>
      
      <div className={styles.ipodContainer}>
        <div className={styles.ipod}>
          <div className={styles.screen}>
            {isPlaying ? (
              <iframe
                src={videoUrl}
                className={styles.video}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube video player"
              />
            ) : (
              <div className={styles.screenPlaceholder} onClick={() => setIsPlaying(true)}>
                <div className={styles.playButton}>
                  ▶
                </div>
                <p className={styles.placeholderText}>Click to play</p>
              </div>
            )}
          </div>
          <div className={styles.wheel}>
            <div className={`${styles.label} ${styles.labelTop}`}>MENU</div>
            <div className={`${styles.label} ${styles.labelLeft}`}>⏮︎</div>
            <div className={`${styles.label} ${styles.labelRight}`}>⏭︎</div>
            <div className={`${styles.label} ${styles.labelBottom}`}>▶︎▮▮</div>
            <div className={styles.centerButton}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

