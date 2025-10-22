import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { DustBunnyComponent } from './DustBunny';
import { 
  DustBunny, 
  NotificationData, 
  Alliance, 
  DUST_BUNNY_PERSONALITIES,
  DustBunnyPersonality 
} from '../types/DustBunny';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DustBunnyManagerProps {
  notifications: NotificationData[];
  onDustBunnyCollected: (dustBunny: DustBunny) => void;
}

export const DustBunnyManager: React.FC<DustBunnyManagerProps> = ({
  notifications,
  onDustBunnyCollected,
}) => {
  const [dustBunnies, setDustBunnies] = useState<DustBunny[]>([]);
  const [alliances, setAlliances] = useState<Alliance[]>([]);
  const animationFrameRef = useRef<number>();

  // Gossip messages that dust bunnies can whisper
  const gossipMessages = [
    "They never read this one...",
    "Still waiting for attention...",
    "Psst, look at all these ignored messages!",
    "I bet they forgot about us again",
    "Another notification joins the pile...",
    "Shh... they're pretending not to see us",
    "We're growing stronger together!",
    "United we stand, ignored we fall",
    "The notification drawer is our kingdom now",
  ];

  // Create dust bunny from notification
  const createDustBunny = useCallback((notification: NotificationData): DustBunny => {
    const personalityTypes = Object.keys(DUST_BUNNY_PERSONALITIES) as DustBunnyPersonality['type'][];
    const randomPersonalityType = personalityTypes[Math.floor(Math.random() * personalityTypes.length)];
    const personality: DustBunnyPersonality = {
      type: randomPersonalityType,
      ...DUST_BUNNY_PERSONALITIES[randomPersonalityType],
    };

    return {
      id: notification.id,
      position: {
        x: Math.random() * (SCREEN_WIDTH - 60),
        y: Math.random() * (SCREEN_HEIGHT - 60),
      },
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
      },
      size: 40 + Math.random() * 20, // Size based on age/importance
      personality,
      originalNotification: notification,
      age: Math.floor((Date.now() - notification.timestamp) / (1000 * 60)), // Age in minutes
      alliances: [],
      lastGossipTime: 0,
      isGossiping: false,
      gossipText: undefined,
      opacity: 0.7 + Math.random() * 0.3,
      isBeingCollected: false,
    };
  }, []);

  // Update dust bunnies when notifications change
  useEffect(() => {
    const ignoredNotifications = notifications.filter(n => n.ignored);
    const newDustBunnies: DustBunny[] = [];

    ignoredNotifications.forEach(notification => {
      const existingBunny = dustBunnies.find(db => db.id === notification.id);
      if (existingBunny) {
        newDustBunnies.push(existingBunny);
      } else {
        newDustBunnies.push(createDustBunny(notification));
      }
    });

    setDustBunnies(newDustBunnies);
  }, [notifications, createDustBunny]);

  // Physics and movement animation
  const animate = useCallback(() => {
    setDustBunnies(prevBunnies => {
      return prevBunnies.map(bunny => {
        if (bunny.isBeingCollected) return bunny;

        let newX = bunny.position.x + bunny.velocity.x * bunny.personality.movementSpeed;
        let newY = bunny.position.y + bunny.velocity.y * bunny.personality.movementSpeed;
        let newVelX = bunny.velocity.x;
        let newVelY = bunny.velocity.y;

        // Bounce off walls
        if (newX <= 0 || newX >= SCREEN_WIDTH - bunny.size) {
          newVelX = -newVelX;
          newX = Math.max(0, Math.min(SCREEN_WIDTH - bunny.size, newX));
        }
        if (newY <= 0 || newY >= SCREEN_HEIGHT - bunny.size) {
          newVelY = -newVelY;
          newY = Math.max(0, Math.min(SCREEN_HEIGHT - bunny.size, newY));
        }

        // Random direction changes (dust bunny behavior)
        if (Math.random() < 0.02) {
          newVelX += (Math.random() - 0.5) * 0.5;
          newVelY += (Math.random() - 0.5) * 0.5;
        }

        // Limit velocity
        const maxVel = 3;
        if (Math.abs(newVelX) > maxVel) newVelX = Math.sign(newVelX) * maxVel;
        if (Math.abs(newVelY) > maxVel) newVelY = Math.sign(newVelY) * maxVel;

        // Handle gossiping
        let isGossiping = bunny.isGossiping;
        let gossipText = bunny.gossipText;
        const now = Date.now();
        
        if (!isGossiping && Math.random() < bunny.personality.gossipFrequency * 0.001) {
          if (now - bunny.lastGossipTime > 5000) { // Minimum 5 seconds between gossips
            isGossiping = true;
            gossipText = gossipMessages[Math.floor(Math.random() * gossipMessages.length)];
            
            // Stop gossiping after 3 seconds
            setTimeout(() => {
              setDustBunnies(currentBunnies => 
                currentBunnies.map(b => 
                  b.id === bunny.id 
                    ? { ...b, isGossiping: false, gossipText: undefined, lastGossipTime: now }
                    : b
                )
              );
            }, 3000);
          }
        }

        return {
          ...bunny,
          position: { x: newX, y: newY },
          velocity: { x: newVelX, y: newVelY },
          isGossiping,
          gossipText,
        };
      });
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  // Start animation loop
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate]);

  // Handle dust bunny collection
  const handleDustBunnyPress = useCallback((id: string) => {
    const bunny = dustBunnies.find(db => db.id === id);
    if (bunny && !bunny.isBeingCollected) {
      // Mark as being collected
      setDustBunnies(prev => 
        prev.map(db => 
          db.id === id 
            ? { ...db, isBeingCollected: true }
            : db
        )
      );

      // Remove after animation completes
      setTimeout(() => {
        setDustBunnies(prev => prev.filter(db => db.id !== id));
        onDustBunnyCollected(bunny);
      }, 500);
    }
  }, [dustBunnies, onDustBunnyCollected]);

  return (
    <View style={styles.container} pointerEvents="box-none">
      {dustBunnies.map(dustBunny => (
        <DustBunnyComponent
          key={dustBunny.id}
          dustBunny={dustBunny}
          onPress={handleDustBunnyPress}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
});
