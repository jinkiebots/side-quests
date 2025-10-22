import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { DustBunny as DustBunnyType } from '../types/DustBunny';

interface DustBunnyComponentProps {
  dustBunny: DustBunnyType;
  onPress: (id: string) => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const DustBunnyComponent: React.FC<DustBunnyComponentProps> = ({ 
  dustBunny, 
  onPress 
}) => {
  const positionX = useRef(new Animated.Value(dustBunny.position.x)).current;
  const positionY = useRef(new Animated.Value(dustBunny.position.y)).current;
  const opacity = useRef(new Animated.Value(dustBunny.opacity)).current;
  const scale = useRef(new Animated.Value(1)).current;

  // Update position when dustBunny position changes
  useEffect(() => {
    Animated.timing(positionX, {
      toValue: dustBunny.position.x,
      duration: 200,
      useNativeDriver: false,
    }).start();

    Animated.timing(positionY, {
      toValue: dustBunny.position.y,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [dustBunny.position.x, dustBunny.position.y]);

  // Update opacity when it changes
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: dustBunny.opacity,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [dustBunny.opacity]);

  // Animate collection
  useEffect(() => {
    if (dustBunny.isBeingCollected) {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [dustBunny.isBeingCollected]);

  const getDustBunnyEmoji = (personality: string): string => {
    switch (personality) {
      case 'mischievous': return '🌪️';
      case 'shy': return '😶';
      case 'chatty': return '💬';
      case 'grumpy': return '😤';
      case 'friendly': return '😊';
      default: return '🌫️';
    }
  };

  const getDustBunnyColor = (personality: string): string => {
    switch (personality) {
      case 'mischievous': return '#ff6b6b';
      case 'shy': return '#a8e6cf';
      case 'chatty': return '#ffd93d';
      case 'grumpy': return '#6c5ce7';
      case 'friendly': return '#fd79a8';
      default: return '#ddd';
    }
  };

  return (
    <>
      <Animated.View
        style={[
          styles.dustBunny,
          {
            left: positionX,
            top: positionY,
            width: dustBunny.size,
            height: dustBunny.size,
            opacity: opacity,
            backgroundColor: getDustBunnyColor(dustBunny.personality.type),
            transform: [{ scale }],
          },
        ]}
        onTouchEnd={() => onPress(dustBunny.id)}
      >
        <Text style={styles.emoji}>
          {getDustBunnyEmoji(dustBunny.personality.type)}
        </Text>
      </Animated.View>
      
      {/* Gossip bubble */}
      {dustBunny.isGossiping && dustBunny.gossipText && (
        <Animated.View
          style={[
            styles.gossipBubble,
            {
              left: dustBunny.position.x + dustBunny.size + 10,
              top: dustBunny.position.y - 20,
              opacity: opacity,
            },
          ]}
        >
          <Text style={styles.gossipText}>{dustBunny.gossipText}</Text>
          <View style={styles.gossipTail} />
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  dustBunny: {
    position: 'absolute',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emoji: {
    fontSize: 20,
  },
  gossipBubble: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    padding: 8,
    maxWidth: 150,
    zIndex: 1000,
  },
  gossipText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  gossipTail: {
    position: 'absolute',
    left: -5,
    top: '50%',
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'rgba(0, 0, 0, 0.8)',
    transform: [{ translateY: -5 }],
  },
});
