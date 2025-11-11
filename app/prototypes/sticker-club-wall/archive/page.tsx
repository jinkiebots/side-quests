'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import styles from '../styles.module.css';

// Helper for image paths
const getImagePath = (path: string) => {
  const parts = path.split('/');
  const encodedParts = parts.map((part, index) => {
    if (!part || index === 0) return part;
    return encodeURIComponent(part);
  });
  const encodedPath = encodedParts.join('/');

  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/ghibli-recipes')) {
    return `/ghibli-recipes${encodedPath}`;
  }
  return encodedPath;
};

interface StickyNote {
  id: string;
  text: string;
  image?: string;
  doodle?: string;
  position: { x: number; y: number };
  rotation: number;
  color: string;
  createdAt: number;
  stickyVariant?: number;
}

export default function ArchivedStickies() {
  const router = useRouter();
  const [archivedNotes, setArchivedNotes] = useState<StickyNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load archived sticky notes from Supabase
  useEffect(() => {
    const fetchArchivedNotes = async () => {
      try {
        const { data, error } = await supabase
          .from('sticky_notes')
          .select('*')
          .eq('archived', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching archived notes:', error);
        } else if (data) {
          // Transform Supabase data to StickyNote format
          const notes: StickyNote[] = data.map((note: any) => ({
            id: note.id,
            text: note.text || '',
            image: note.image || undefined,
            doodle: note.doodle || undefined,
            position: {
              x: note.position_x || 0,
              y: note.position_y || 0,
            },
            rotation: note.rotation || 0,
            color: note.color || '#ffeb3b',
            createdAt: new Date(note.created_at).getTime(),
            stickyVariant: note.sticky_variant ?? (parseInt(note.id.slice(-1)) % 3),
          }));

          setArchivedNotes(notes);
        }
      } catch (error) {
        console.error('Error loading archived notes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArchivedNotes();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.bulletinBoard}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>Archived Stickies</h1>
          <p className={styles.subtitle}>View all previously archived notes</p>
          <button
            className={styles.createButton}
            onClick={() => router.push('/prototypes/sticker-club-wall')}
          >
            ← Back to Wall
          </button>
        </header>

        {/* Archived Notes Grid */}
        <div className={styles.archiveGrid}>
          {isLoading && (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>Loading archived notes...</p>
            </div>
          )}

          {!isLoading && archivedNotes.length === 0 && (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>No archived notes yet!</p>
            </div>
          )}

          {!isLoading && archivedNotes.map((note) => {
            const stickyVariant = note.stickyVariant ?? 0;
            const stickyImage = getImagePath(
              stickyVariant === 0 ? '/images/sticky mail/sticky1.svg' :
              stickyVariant === 1 ? '/images/sticky mail/sticky2.svg' :
              '/images/sticky mail/sticky3.svg'
            );

            return (
              <div
                key={note.id}
                className={styles.archiveNote}
              >
                {/* Sticky Note SVG Background */}
                <img
                  src={stickyImage}
                  alt="Sticky Note"
                  className={styles.stickyNoteBackground}
                />

                {/* Note Content */}
                <div className={styles.noteContent}>
                  {note.image && (
                    <img src={note.image} alt="Uploaded" className={styles.noteImage} />
                  )}
                  {note.doodle && (
                    <img src={note.doodle} alt="Doodle" className={styles.noteDoodle} />
                  )}
                  {note.text && (
                    <p className={styles.noteText}>{note.text}</p>
                  )}
                </div>

                {/* Date */}
                <div className={styles.archiveDate}>
                  {new Date(note.createdAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
