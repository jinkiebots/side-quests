import { NotificationData } from '../types/DustBunny';

class NotificationService {
  private notifications: NotificationData[] = [];
  private listeners: ((notifications: NotificationData[]) => void)[] = [];

  // Mock notifications for testing
  private mockNotifications: Omit<NotificationData, 'id' | 'timestamp' | 'ignored'>[] = [
    {
      title: "New Message",
      body: "Hey, are you free for lunch?",
      appName: "Messages",
    },
    {
      title: "Software Update",
      body: "iOS 17.1 is now available",
      appName: "Settings",
    },
    {
      title: "Reminder",
      body: "Don't forget about the meeting at 3 PM",
      appName: "Reminders",
    },
    {
      title: "Breaking News",
      body: "Local weather update: Sunny skies ahead",
      appName: "News",
    },
    {
      title: "Social Media",
      body: "John liked your photo",
      appName: "Instagram",
    },
    {
      title: "Email",
      body: "You have 5 new emails",
      appName: "Mail",
    },
    {
      title: "Calendar",
      body: "Event starting in 15 minutes",
      appName: "Calendar",
    },
    {
      title: "Gaming",
      body: "Your daily reward is ready!",
      appName: "Game",
    },
  ];

  constructor() {
    // Start with some initial mock notifications for demo
    this.addMockNotification();
    this.addMockNotification();
    
    // Periodically add new notifications for demo purposes
    setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every interval
        this.addMockNotification();
      }
    }, 10000); // Every 10 seconds
  }

  private addMockNotification() {
    const mockNotif = this.mockNotifications[
      Math.floor(Math.random() * this.mockNotifications.length)
    ];
    
    const notification: NotificationData = {
      ...mockNotif,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      ignored: false,
    };

    this.notifications.push(notification);
    
    // Auto-ignore notification after some time (simulating user behavior)
    setTimeout(() => {
      this.markAsIgnored(notification.id);
    }, Math.random() * 15000 + 5000); // Random between 5-20 seconds

    this.notifyListeners();
  }

  public addNotification(notification: Omit<NotificationData, 'id' | 'timestamp'>): void {
    const newNotification: NotificationData = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };

    this.notifications.push(newNotification);
    this.notifyListeners();
  }

  public markAsIgnored(id: string): void {
    this.notifications = this.notifications.map(notif =>
      notif.id === id ? { ...notif, ignored: true } : notif
    );
    this.notifyListeners();
  }

  public removeNotification(id: string): void {
    this.notifications = this.notifications.filter(notif => notif.id !== id);
    this.notifyListeners();
  }

  public getNotifications(): NotificationData[] {
    return [...this.notifications];
  }

  public getIgnoredNotifications(): NotificationData[] {
    return this.notifications.filter(notif => notif.ignored);
  }

  public subscribe(listener: (notifications: NotificationData[]) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  // Future: Real notification integration
  public async requestPermissions(): Promise<boolean> {
    // This would request real notification permissions
    // For now, return true for mock data
    return true;
  }

  public async setupNotificationInterceptor(): Promise<void> {
    // This would set up real notification interception
    // Implementation would depend on platform capabilities
    console.log('Setting up notification interceptor (mock)');
  }
}

export const notificationService = new NotificationService();
