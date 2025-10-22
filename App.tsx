import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { DustBunnyManager } from './src/components/DustBunnyManager';
import { notificationService } from './src/services/NotificationService';
import { NotificationData, DustBunny } from './src/types/DustBunny';
import { Vibe } from './src/theme/vibe';

export default function App() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [collectedBunnies, setCollectedBunnies] = useState<DustBunny[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Subscribe to notification updates
    const unsubscribe = notificationService.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications);
    });

    // Initialize with current notifications
    setNotifications(notificationService.getNotifications());

    return unsubscribe;
  }, []);

  const handleDustBunnyCollected = (dustBunny: DustBunny) => {
    setCollectedBunnies(prev => [...prev, dustBunny]);
    setScore(prev => prev + 10);
    
    // Remove the original notification
    notificationService.removeNotification(dustBunny.id);
    
    // Show collection message
    Alert.alert(
      '✨ Dust Bunny Collected!',
      `You collected a ${dustBunny.personality.type} dust bunny!\n\nOriginal notification: "${dustBunny.originalNotification.title}"\n\n+10 points!`,
      [{ text: 'Nice!', style: 'default' }]
    );
  };

  const addTestNotification = () => {
    notificationService.addNotification({
      title: 'Test Notification',
      body: 'This is a test notification that will become a dust bunny!',
      appName: 'Dust Bunny App',
      ignored: false,
    });
  };

  const ignoredCount = notifications.filter(n => n.ignored).length;
  const totalCount = notifications.length;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Main background */}
      <View style={styles.background}>
        <Text style={styles.title}>Dust Bunny Collection</Text>
        <Text style={styles.subtitle}>your ignored notifications come to life</Text>
      </View>

      {/* Stats panel */}
      <SafeAreaView style={styles.statsContainer}>
        <View style={styles.statsPanel}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{score}</Text>
            <Text style={styles.statLabel}>Score</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{ignoredCount}</Text>
            <Text style={styles.statLabel}>Active Bunnies</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{collectedBunnies.length}</Text>
            <Text style={styles.statLabel}>Collected</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalCount}</Text>
            <Text style={styles.statLabel}>Total Notifications</Text>
          </View>
        </View>
        
        {/* Test button */}
        <TouchableOpacity style={styles.testButton} onPress={addTestNotification}>
          <Text style={styles.testButtonText}>+ add test notification</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Dust Bunny Manager - handles all the dust bunnies */}
      <DustBunnyManager 
        notifications={notifications}
        onDustBunnyCollected={handleDustBunnyCollected}
      />

      {/* Instructions */}
      {ignoredCount === 0 && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructions}>notifications wander off and become little bunnies</Text>
          <Text style={styles.instructions}>tap the button, wait a bit, then say hi</Text>
          <Text style={styles.instructions}>tap a bunny to collect it — +10</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Vibe.colors.paper,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: Vibe.colors.ink,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Vibe.colors.mutedInk,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontStyle: 'italic',
  },
  statsContainer: {
    marginTop: 120,
    paddingHorizontal: 20,
  },
  statsPanel: {
    flexDirection: 'row',
    backgroundColor: Vibe.colors.panel,
    borderRadius: Vibe.borders.radius,
    padding: 20,
    justifyContent: 'space-between',
    borderWidth: Vibe.borders.width,
    borderColor: 'rgba(42,42,42,0.15)',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Vibe.colors.ink,
  },
  statLabel: {
    fontSize: 12,
    color: Vibe.colors.mutedInk,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  testButton: {
    backgroundColor: Vibe.colors.accent,
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginTop: 20,
    borderWidth: Vibe.borders.width,
    borderColor: 'rgba(42,42,42,0.2)',
  },
  testButtonText: {
    color: Vibe.colors.ink,
    fontSize: 16,
    fontWeight: '600',
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: Vibe.colors.accentYellow,
    borderRadius: Vibe.borders.radius,
    padding: 16,
    borderWidth: Vibe.borders.width,
    borderColor: 'rgba(42,42,42,0.18)',
  },
  instructions: {
    color: Vibe.colors.ink,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 20,
  },
});
