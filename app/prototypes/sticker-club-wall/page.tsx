'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import styles from './styles.module.css';

// Helper for image paths
const getImagePath = (path: string) => {
  // Don't encode slashes, only encode the actual path segments
  const parts = path.split('/');
  const encodedParts = parts.map((part, index) => {
    // Don't encode empty strings (leading/trailing slashes) or already encoded parts
    if (!part || index === 0) return part;
    return encodeURIComponent(part);
  });
  const encodedPath = encodedParts.join('/');
  
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/side-quests')) {
    return `/side-quests${encodedPath}`;
  }
  return encodedPath;
};

interface StickyNote {
  id: string;
  text: string;
  image?: string; // base64 or URL
  doodle?: string; // base64 canvas data
  position: { x: number; y: number };
  rotation: number;
  color: string;
  createdAt: number;
  stickyVariant?: number; // 0, 1, or 2 for sticky1, sticky2, sticky3
}

const STICKY_COLORS = ['#ffeb3b', '#ff9800', '#4caf50', '#2196f3', '#e91e63', '#9c27b0'];

// Profanity filter - block inappropriate words and common variations
const INAPPROPRIATE_WORDS = [
  'fuck', 'fck', 'f*ck', 'fuk', 'f_ck',
  'shit', 'sh1t', 'sh*t', 'sht',
  'dick', 'd1ck', 'd*ck', 'dck',
  'pussy', 'p*ssy', 'pssyt', 'psy',
  'bitch', 'b1tch', 'b*tch', 'btch',
  'ass', 'a$$', 'a55',
  'boob', 'b00b', 'boobies', 'b00bies',
  'cock', 'c0ck', 'c*ck',
  'damn', 'dmn', 'd*mn',
  'hell', 'h3ll', 'h*ll',
  'penis', 'p3nis', 'pen1s',
  'vagina', 'vag1na', 'v*gina',
  'sex', 's3x', 's*x',
  'porn', 'p0rn', 'pr0n',
  'cum', 'c*m', 'cvm',
  'whore', 'wh0re', 'wh*re',
  'slut', 'sl*t', 'slvt',
  'bastard', 'b*stard', 'bstrd',
  'crap', 'cr*p', 'crp',
  'piss', 'p1ss', 'p*ss'
];

const containsInappropriateContent = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  // Remove common obfuscation characters for checking
  const normalizedText = lowerText
    .replace(/[*_\-@#$%]/g, '')
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b');

  return INAPPROPRIATE_WORDS.some(word => {
    const normalizedWord = word
      .replace(/[*_\-@#$%]/g, '')
      .replace(/0/g, 'o')
      .replace(/1/g, 'i')
      .replace(/3/g, 'e')
      .replace(/4/g, 'a')
      .replace(/5/g, 's')
      .replace(/7/g, 't')
      .replace(/8/g, 'b');

    // Use word boundary regex to avoid matching single letters or partial words
    // \b requires at least 2 characters to work properly, so skip very short normalized words
    if (normalizedWord.length < 2) return false;

    const wordBoundaryRegex = new RegExp(`\\b${normalizedWord}\\b`, 'i');
    return wordBoundaryRegex.test(normalizedText);
  });
};

export default function StickerClubWall() {
  const router = useRouter();
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [selectedColor, setSelectedColor] = useState(STICKY_COLORS[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [doodleCanvas, setDoodleCanvas] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'text' | 'image' | 'doodle'>('text');
  const [isDrawing, setIsDrawing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const notesContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [draggingNote, setDraggingNote] = useState<string | null>(null);
  const dragStartPosRef = useRef<{ x: number; y: number; noteX: number; noteY: number; offsetX: number; offsetY: number } | null>(null);
  const stickyNotesRef = useRef<StickyNote[]>([]);

  // Sound effect functions
  const playSound = (soundName: 'cowbell' | 'sparkle' | 'squeak') => {
    const soundPaths = {
      cowbell: getImagePath('/images/sticky mail/Cowbell Sharp Hit Sound.wav'),
      sparkle: getImagePath('/images/sticky mail/Sparkle Hybrid Transition.wav'),
      squeak: getImagePath('/images/sticky mail/Squeak Notification Sound.wav'),
    };

    const audio = new Audio(soundPaths[soundName]);
    audio.volume = 0.5;
    audio.play().catch(err => console.log('Audio play failed:', err));
  };

  // Keep stickyNotesRef in sync with stickyNotes state
  useEffect(() => {
    stickyNotesRef.current = stickyNotes;
  }, [stickyNotes]);

  // Load sticky notes from Supabase on mount
  useEffect(() => {
    const fetchStickyNotes = async () => {
      // Wait for container to be rendered
      await new Promise(resolve => setTimeout(resolve, 200));
      
      try {
        // Fetch non-archived sticky notes (or notes without archived field for backward compatibility)
        const { data, error } = await supabase
          .from('sticky_notes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching sticky notes:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          
          // If table doesn't exist, show helpful message
          if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
            console.warn('The sticky_notes table does not exist in Supabase. Please create it using the SQL in SUPABASE_SETUP.md');
          }
        } else if (data) {
          // Get container bounds
          const container = notesContainerRef.current;
          const containerRect = container?.getBoundingClientRect();
          const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;
          const noteWidth = isMobile ? 200 : 350;
          const noteHeight = isMobile ? 250 : 300;
          const headerHeight = isMobile ? 120 : 200;
          
          // Filter out archived notes and transform Supabase data to StickyNote format
          const filteredData = data.filter((note: any) => !note.archived);

          const notes: StickyNote[] = filteredData.map((note: any, index: number) => {
            return {
              id: note.id,
              text: note.text || '',
              image: note.image || undefined,
              doodle: note.doodle || undefined,
              position: {
                x: note.position_x || 0,
                y: note.position_y || 0,
              },
              rotation: note.rotation || 0,
              color: note.color || STICKY_COLORS[0],
              createdAt: new Date(note.created_at).getTime(),
              stickyVariant: note.sticky_variant ?? (parseInt(note.id.slice(-1)) % 3),
            };
          });

          setStickyNotes(notes);
          stickyNotesRef.current = notes;
        }
      } catch (error) {
        console.error('Error loading sticky notes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStickyNotes();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        setDoodleCanvas(canvas.toDataURL());
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setDoodleCanvas(null);
      }
    }
  };

  // Initialize canvas when entering doodle mode
  useEffect(() => {
    if (activeMode === 'doodle' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set canvas defaults
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [activeMode]);

  const handlePostSticky = async () => {
    if (!currentText.trim()) {
      playSound('cowbell');
      alert('Please enter some text for your sticky note.');
      return;
    }

    // Check for inappropriate content
    if (containsInappropriateContent(currentText)) {
      playSound('cowbell');
      alert('Your message contains inappropriate content. Please keep it friendly!');
      return;
    }

    // Calculate positions that fit within the bulletin board container
    const isMobile = window.innerWidth <= 480;
    const noteWidth = isMobile ? 200 : 350;
    const noteHeight = isMobile ? 250 : 300;
    const headerHeight = isMobile ? 120 : 200;
    
    // Get container bounds
    const container = notesContainerRef.current;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    // Calculate valid position within bulletin board bounds
    const maxX = containerWidth - noteWidth - 20;
    const maxY = containerHeight - noteHeight - 20;
    const minX = 10;
    const minY = Math.max(0, headerHeight - containerRect.top);
    
    const positionX = Math.random() * (maxX - minX) + minX;
    const positionY = Math.random() * (maxY - minY) + minY;
    const rotation = (Math.random() - 0.5) * 10; // Random rotation between -5 and 5 degrees
    const randomColor = STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)]; // Random color
    const randomStickyVariant = Math.floor(Math.random() * 3); // Random sticky variant 0, 1, or 2

    // Insert into Supabase
    // Try with sticky_variant first, fall back without it if column doesn't exist
    let data, error;
    try {
      const result = await supabase
        .from('sticky_notes')
        .insert({
          text: currentText,
          image: null,
          doodle: null,
          position_x: positionX,
          position_y: positionY,
          rotation: rotation,
          color: randomColor,
          sticky_variant: randomStickyVariant,
        })
        .select()
        .single();
      data = result.data;
      error = result.error;
    } catch (err) {
      // If sticky_variant column doesn't exist, try without it
      const result = await supabase
        .from('sticky_notes')
        .insert({
          text: currentText,
          image: null,
          doodle: null,
          position_x: positionX,
          position_y: positionY,
          rotation: rotation,
          color: randomColor,
        })
        .select()
        .single();
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Error posting sticky note:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));

      // More specific error messages
      let errorMessage = 'Failed to post sticky note. ';
      if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        errorMessage += 'The database table may not exist yet. Please create the "sticky_notes" table in Supabase.';
      } else if (error.message) {
        errorMessage += `Error: ${error.message}`;
      } else {
        errorMessage += 'Please try again.';
      }

      playSound('cowbell');
      alert(errorMessage);
      return;
    }

    if (data) {
      // Play sparkle sound for successful post
      playSound('sparkle');

      // Transform Supabase response to StickyNote format
      const newNote: StickyNote = {
        id: data.id,
        text: data.text || '',
        image: data.image || undefined,
        doodle: data.doodle || undefined,
        position: {
          x: data.position_x,
          y: data.position_y,
        },
        rotation: data.rotation || 0,
        color: data.color || randomColor,
        createdAt: new Date(data.created_at).getTime(),
        stickyVariant: data.sticky_variant ?? randomStickyVariant,
      };

      const updatedNotes = [newNote, ...stickyNotes];
      setStickyNotes(updatedNotes);

      // Auto-archive: If we now have 20 or more notes, archive the oldest ones
      if (updatedNotes.length >= 20) {
        const notesToArchive = updatedNotes.slice(19); // Everything after the 19th note (keep 19, archive the rest)

        // Archive the excess notes in the background
        notesToArchive.forEach(async (note) => {
          try {
            await supabase
              .from('sticky_notes')
              .update({ archived: true })
              .eq('id', note.id);
          } catch (err) {
            console.error('Error archiving note:', err);
          }
        });

        // Remove archived notes from display
        setStickyNotes(updatedNotes.slice(0, 19));
      }
    }

    // Reset form
    setCurrentText('');
    setShowCreateModal(false);
  };

  const handleCancel = () => {
    setCurrentText('');
    setShowCreateModal(false);
  };

  // Handle dragging sticky notes
  const handleNoteMouseDown = (e: React.MouseEvent, noteId: string) => {
    // Don't start drag if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON') {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const note = stickyNotesRef.current.find(n => n.id === noteId);
    if (!note) return;

    // Store the mouse start position and note's current position
    dragStartPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      noteX: note.position.x,
      noteY: note.position.y,
      offsetX: 0,
      offsetY: 0,
    };

    setDraggingNote(noteId);
  };

  useEffect(() => {
    if (!draggingNote || !dragStartPosRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      if (!dragStartPosRef.current) return;

      // Calculate how much the mouse has moved
      const deltaX = e.clientX - dragStartPosRef.current.x;
      const deltaY = e.clientY - dragStartPosRef.current.y;

      // Add the delta to the note's original position
      const newX = dragStartPosRef.current.noteX + deltaX;
      const newY = dragStartPosRef.current.noteY + deltaY;

      setStickyNotes(prev =>
        prev.map(note =>
          note.id === draggingNote
            ? { ...note, position: { x: newX, y: newY } }
            : note
        )
      );
    };

    const handleMouseUp = async () => {
      if (!draggingNote) return;

      // Play squeak sound when dropping note
      playSound('squeak');

      // Save new position to Supabase
      const note = stickyNotesRef.current.find(n => n.id === draggingNote);
      if (note) {
        try {
          await supabase
            .from('sticky_notes')
            .update({
              position_x: note.position.x,
              position_y: note.position.y,
            })
            .eq('id', note.id);
        } catch (error) {
          console.error('Error updating note position:', error);
        }
      }

      setDraggingNote(null);
      dragStartPosRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingNote]);

  return (
    <div className={styles.container}>
      <div className={styles.bulletinBoard}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>Sticky Wall Club</h1>
          <p className={styles.subtitle}>Leave your anonymous notes</p>
          <div className={styles.buttonGroup}>
            <button
              className={styles.createButton}
              onClick={() => setShowCreateModal(true)}
            >
              Create Sticky Note
            </button>
            <button
              className={styles.archiveButton}
              onClick={() => router.push('/prototypes/sticker-club-wall/archive')}
            >
              View Archived Stickies
            </button>
          </div>
        </header>

        {/* Sticky Notes Display */}
        <div ref={notesContainerRef} className={styles.notesContainer}>
          {stickyNotes.map((note) => {
            // Use stored variant (should always be set)
            const stickyVariant = note.stickyVariant ?? 0;
            const stickyImage = getImagePath(
              stickyVariant === 0 ? '/images/sticky mail/sticky1.svg' :
              stickyVariant === 1 ? '/images/sticky mail/sticky2.svg' :
              '/images/sticky mail/sticky3.svg'
            );
            
            return (
            <div
              key={note.id}
              className={`${styles.stickyNote} ${draggingNote === note.id ? styles.dragging : ''}`}
              style={{
                left: `${note.position.x}px`,
                top: `${note.position.y}px`,
                transform: `rotate(${note.rotation}deg)`,
              }}
              onMouseDown={(e) => handleNoteMouseDown(e, note.id)}
            >
              {/* Sticky Note SVG Background */}
              <img 
                src={stickyImage}
                alt="Sticky Note"
                className={styles.stickyNoteBackground}
              />
              
              {/* Pin at top middle */}
              <div className={styles.pin}>
                <img 
                  src={getImagePath('/images/home/pin.png')} 
                  alt="Pin" 
                  className={styles.pinImage}
                />
              </div>
              
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
            </div>
            );
          })}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>Loading sticky notes...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && stickyNotes.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No sticky notes yet. Be the first to leave one!</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={handleCancel}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Create Your Sticky Note</h2>
              <button className={styles.closeButton} onClick={handleCancel}>×</button>
            </div>

            <div className={styles.modalContent}>
              {/* Text Input Only */}
              <div className={styles.textMode}>
                <textarea
                  className={styles.textInput}
                  placeholder="Write your note here... (Keep it friendly!)"
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  rows={8}
                  maxLength={200}
                />
                <div className={styles.charCount}>
                  {currentText.length}/200 characters
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={handleCancel}>
                Cancel
              </button>
              <button
                className={styles.postButton}
                onClick={handlePostSticky}
                disabled={!currentText.trim()}
              >
                Post to Wall
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
