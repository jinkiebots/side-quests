'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import styles from './styles.module.css';

// Helper for image paths
const getImagePath = (path: string) => {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/ghibli-recipes')) {
    return `/ghibli-recipes${path}`;
  }
  return path;
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
}

const STICKY_COLORS = ['#ffeb3b', '#ff9800', '#4caf50', '#2196f3', '#e91e63', '#9c27b0'];

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

  // Keep stickyNotesRef in sync with stickyNotes state
  useEffect(() => {
    stickyNotesRef.current = stickyNotes;
  }, [stickyNotes]);

  // Load sticky notes from Supabase on mount
  useEffect(() => {
    const fetchStickyNotes = async () => {
      // Wait a bit for container to be rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
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
          // Transform Supabase data to StickyNote format and clamp positions
          const notes: StickyNote[] = data.map((note: any) => {
            // Get container bounds to clamp positions
            const container = notesContainerRef.current;
            let clampedX = note.position_x || 0;
            let clampedY = note.position_y || 0;
            
            if (container) {
              const containerRect = container.getBoundingClientRect();
              const isMobile = window.innerWidth <= 480;
              const noteWidth = isMobile ? 140 : 250;
              const noteHeight = isMobile ? 100 : 200;
              
              // Clamp to container bounds
              clampedX = Math.max(0, Math.min(clampedX, containerRect.width - noteWidth));
              clampedY = Math.max(0, Math.min(clampedY, containerRect.height - noteHeight));
            }
            
            return {
              id: note.id,
              text: note.text || '',
              image: note.image || undefined,
              doodle: note.doodle || undefined,
              position: {
                x: clampedX,
                y: clampedY,
              },
              rotation: note.rotation || 0,
              color: note.color || STICKY_COLORS[0],
              createdAt: new Date(note.created_at).getTime(),
            };
          });
          setStickyNotes(notes);
          stickyNotesRef.current = notes;
          
          // Update positions in Supabase if they were clamped
          notes.forEach((note, index) => {
            const original = data[index];
            if (original.position_x !== note.position.x || original.position_y !== note.position.y) {
              supabase
                .from('sticky_notes')
                .update({
                  position_x: note.position.x,
                  position_y: note.position.y,
                })
                .eq('id', note.id)
                .catch(err => console.error('Error updating clamped position:', err));
            }
          });
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
    if (!currentText && !uploadedImage && !doodleCanvas) {
      return; // Don't post empty notes
    }

    // Calculate positions that fit within the bulletin board container
    const isMobile = window.innerWidth <= 480;
    const noteWidth = isMobile ? 140 : 250;
    const noteHeight = isMobile ? 100 : 200;
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

    // Insert into Supabase
    const { data, error } = await supabase
      .from('sticky_notes')
      .insert({
        text: currentText || null,
        image: uploadedImage || null,
        doodle: doodleCanvas || null,
        position_x: positionX,
        position_y: positionY,
        rotation: rotation,
        color: selectedColor,
      })
      .select()
      .single();

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
      
      alert(errorMessage);
      return;
    }

    if (data) {
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
        color: data.color || selectedColor,
        createdAt: new Date(data.created_at).getTime(),
      };

      setStickyNotes([newNote, ...stickyNotes]);
    }
    
    // Reset form
    setCurrentText('');
    setUploadedImage(null);
    setDoodleCanvas(null);
    clearCanvas();
    setShowCreateModal(false);
    setActiveMode('text');
  };

  const handleCancel = () => {
    setCurrentText('');
    setUploadedImage(null);
    setDoodleCanvas(null);
    clearCanvas();
    setShowCreateModal(false);
    setActiveMode('text');
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
    if (!note || !notesContainerRef.current) return;

    const containerRect = notesContainerRef.current.getBoundingClientRect();
    const noteElement = e.currentTarget as HTMLElement;
    const noteRect = noteElement.getBoundingClientRect();
    
    // Calculate offset from mouse to note's top-left corner
    const offsetX = e.clientX - noteRect.left;
    const offsetY = e.clientY - noteRect.top;

    dragStartPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      noteX: note.position.x,
      noteY: note.position.y,
      offsetX: offsetX,
      offsetY: offsetY,
    };

    setDraggingNote(noteId);
  };

  useEffect(() => {
    if (!draggingNote || !dragStartPosRef.current || !notesContainerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      if (!dragStartPosRef.current || !notesContainerRef.current) return;

      const containerRect = notesContainerRef.current.getBoundingClientRect();
      
      // Calculate new position based on mouse position minus the offset
      let newX = e.clientX - containerRect.left - dragStartPosRef.current.offsetX;
      let newY = e.clientY - containerRect.top - dragStartPosRef.current.offsetY;

      // Get note dimensions
      const isMobile = window.innerWidth <= 480;
      const noteWidth = isMobile ? 140 : 250;
      const noteHeight = isMobile ? 100 : 200;

      // Constrain to container bounds (keep within bulletin board)
      // Allow slight negative values while dragging to make it feel more natural
      const constrainedX = Math.max(-50, Math.min(newX, containerRect.width - noteWidth + 50));
      const constrainedY = Math.max(-50, Math.min(newY, containerRect.height - noteHeight + 50));

      setStickyNotes(prev => 
        prev.map(note => 
          note.id === draggingNote
            ? { ...note, position: { x: constrainedX, y: constrainedY } }
            : note
        )
      );
    };

    const handleMouseUp = async () => {
      if (!draggingNote) return;

      // Save new position to Supabase, clamping to valid bounds
      const note = stickyNotesRef.current.find(n => n.id === draggingNote);
      if (note && notesContainerRef.current) {
        const containerRect = notesContainerRef.current.getBoundingClientRect();
        const isMobile = window.innerWidth <= 480;
        const noteWidth = isMobile ? 140 : 250;
        const noteHeight = isMobile ? 100 : 200;
        
        // Clamp to valid bounds before saving
        const clampedX = Math.max(0, Math.min(note.position.x, containerRect.width - noteWidth));
        const clampedY = Math.max(0, Math.min(note.position.y, containerRect.height - noteHeight));
        
        // Update state with clamped position
        setStickyNotes(prev => 
          prev.map(n => 
            n.id === draggingNote
              ? { ...n, position: { x: clampedX, y: clampedY } }
              : n
          )
        );
        
        try {
          await supabase
            .from('sticky_notes')
            .update({
              position_x: clampedX,
              position_y: clampedY,
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
      <div 
        className={styles.bulletinBoard}
        style={{
          backgroundImage: `url(${getImagePath('/images/sticky mail/bulletin.jpg')})`
        }}
      >
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>Sticker Club Wall</h1>
          <p className={styles.subtitle}>Leave your anonymous doodles, notes, and digital stickers</p>
          <button 
            className={styles.createButton}
            onClick={() => setShowCreateModal(true)}
          >
Create Sticky Note
          </button>
        </header>

        {/* Sticky Notes Display */}
        <div ref={notesContainerRef} className={styles.notesContainer}>
          {stickyNotes.map((note) => {
            // Consistently assign sticky image based on note ID (for persistence)
            const stickyImageNum = parseInt(note.id.slice(-1)) % 2 === 0 ? '2' : '1';
            const stickyImage = getImagePath(`/images/sticky mail/sticky${stickyImageNum}.jpg`);
            
            return (
            <div
              key={note.id}
              className={`${styles.stickyNote} ${draggingNote === note.id ? styles.dragging : ''}`}
              style={{
                left: `${note.position.x}px`,
                top: `${note.position.y}px`,
                backgroundImage: `url(${stickyImage})`,
                transform: `rotate(${note.rotation}deg)`,
              }}
              onMouseDown={(e) => handleNoteMouseDown(e, note.id)}
            >
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
              {/* Mode Selection */}
              <div className={styles.modeSelector}>
                <button
                  className={`${styles.modeButton} ${activeMode === 'text' ? styles.active : ''}`}
                  onClick={() => setActiveMode('text')}
                >
                  📝 Text
                </button>
                <button
                  className={`${styles.modeButton} ${activeMode === 'image' ? styles.active : ''}`}
                  onClick={() => setActiveMode('image')}
                >
                  🖼️ Image
                </button>
                <button
                  className={`${styles.modeButton} ${activeMode === 'doodle' ? styles.active : ''}`}
                  onClick={() => setActiveMode('doodle')}
                >
                  ✏️ Doodle
                </button>
              </div>

              {/* Color Picker */}
              <div className={styles.colorPicker}>
                <label>Choose sticky note color:</label>
                <div className={styles.colorOptions}>
                  {STICKY_COLORS.map((color) => (
                    <button
                      key={color}
                      className={styles.colorButton}
                      style={{
                        backgroundColor: color,
                        border: selectedColor === color ? '3px solid #333' : '1px solid #ccc',
                      }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>

              {/* Text Mode */}
              {activeMode === 'text' && (
                <div className={styles.textMode}>
                  <textarea
                    className={styles.textInput}
                    placeholder="Write your note here..."
                    value={currentText}
                    onChange={(e) => setCurrentText(e.target.value)}
                    rows={6}
                  />
                </div>
              )}

              {/* Image Mode */}
              {activeMode === 'image' && (
                <div className={styles.imageMode}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <button
                    className={styles.uploadButton}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📤 Upload Image
                  </button>
                  {uploadedImage && (
                    <div className={styles.imagePreview}>
                      <img src={uploadedImage} alt="Preview" />
                      <button
                        className={styles.removeButton}
                        onClick={() => setUploadedImage(null)}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Doodle Mode */}
              {activeMode === 'doodle' && (
                <div className={styles.doodleMode}>
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={300}
                    className={styles.doodleCanvas}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                  <button className={styles.clearButton} onClick={clearCanvas}>
                    Clear Canvas
                  </button>
                </div>
              )}

              {/* Mixed: Allow adding text to image/doodle */}
              {(activeMode === 'image' || activeMode === 'doodle') && (
                <div className={styles.additionalText}>
                  <label>Add text (optional):</label>
                  <textarea
                    className={styles.textInput}
                    placeholder="Add some text..."
                    value={currentText}
                    onChange={(e) => setCurrentText(e.target.value)}
                    rows={3}
                  />
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={handleCancel}>
                Cancel
              </button>
              <button
                className={styles.postButton}
                onClick={handlePostSticky}
                disabled={!currentText && !uploadedImage && !doodleCanvas}
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
