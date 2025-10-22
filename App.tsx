import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { DustBunnyManager } from './src/components/DustBunnyManager';
import { notificationService } from './src/services/NotificationService';
import { NotificationData, DustBunny } from './src/types/DustBunny';

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
      <StatusBar style="light" />
      
      {/* Main background */}
      <View style={styles.background}>
        <Text style={styles.title}>🌪️ Dust Bunny Collection</Text>
        <Text style={styles.subtitle}>Your ignored notifications come to life!</Text>
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
          <Text style={styles.testButtonText}>+ Add Test Notification</Text>
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
          <Text style={styles.instructions}>
            📱 Notifications will automatically appear and turn into dust bunnies when ignored!
          </Text>
          <Text style={styles.instructions}>
            👆 Tap the button above to add a test notification, then wait for it to become a dust bunny.
          </Text>
          <Text style={styles.instructions}>
            🎯 Tap dust bunnies to collect them and earn points!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: '#16213e',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#a8a8a8',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  statsContainer: {
    marginTop: 120,
    paddingHorizontal: 20,
  },
  statsPanel: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#a8a8a8',
    marginTop: 4,
  },
  testButton: {
    backgroundColor: '#4ecdc4',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignSelf: 'center',
    marginTop: 20,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    padding: 20,
  },
  instructions: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 20,
  },
});
