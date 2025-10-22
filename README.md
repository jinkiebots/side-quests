# 🌪️ Dust Bunny Collection

> Your ignored notifications become sentient dust bunnies that roll around your screen, occasionally forming alliances and whispering gossip about you.

## ✨ Features

- **Living Notifications**: Ignored notifications transform into animated dust bunnies with unique personalities
- **Personality System**: Each dust bunny has traits like mischievous, shy, chatty, grumpy, or friendly
- **Alliance Formation**: Dust bunnies team up and whisper gossip about your notification habits
- **Interactive Collection**: Tap dust bunnies to collect them and earn points
- **Real-time Animation**: Smooth physics-based movement with bouncing and wandering behavior
- **Beautiful UI**: Dark theme with modern design and engaging visual effects

## 🎮 How It Works

1. **Notifications Appear**: New notifications show up normally
2. **Ignore Timer**: After 5-20 seconds of being ignored, notifications become dust bunnies
3. **Dust Bunny Life**: They roll around your screen with different personalities and behaviors
4. **Gossip & Alliances**: They occasionally form groups and whisper about your habits
5. **Collection Game**: Tap them to collect points and clean up your notification space

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI

### Installation

```bash
git clone https://github.com/yourusername/dust-bunnies.git
cd dust-bunnies
npm install
```

### Running the App

```bash
# Start Expo development server
npx expo start

# For web preview
npx expo start --web

# For iOS (requires iOS Simulator)
npx expo start --ios

# For Android (requires Android Emulator)
npx expo start --android
```

### Mobile Testing
1. Install **Expo Go** from App Store or Google Play
2. Scan the QR code from the Expo dev server
3. Watch your notifications come to life!

## 🏗️ Project Structure

```
dust-bunny-collection/
├── src/
│   ├── components/
│   │   ├── DustBunny.tsx          # Individual dust bunny component
│   │   └── DustBunnyManager.tsx   # Manages all dust bunnies
│   ├── services/
│   │   └── NotificationService.ts # Handles notifications & mock data
│   └── types/
│       └── DustBunny.ts           # TypeScript interfaces
├── App.tsx                        # Main app component
└── package.json
```

## 🎨 Dust Bunny Personalities

- **🌪️ Mischievous**: Fast-moving, hard to catch, loves causing trouble
- **😶 Shy**: Slow and quiet, easy to collect, rarely gossips
- **💬 Chatty**: Loves to gossip, forms alliances easily
- **😤 Grumpy**: Stubborn movement, resistant to collection
- **😊 Friendly**: Social, forms alliances, moderate difficulty

## 🔮 Future Features

- [ ] Real notification integration (iOS/Android permissions)
- [ ] Advanced alliance behaviors and group movements  
- [ ] Achievement system and dust bunny collection gallery
- [ ] Customizable dust bunny appearances
- [ ] Sound effects and haptic feedback
- [ ] Background app operation
- [ ] Notification history and analytics

## 🛠️ Built With

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Native Reanimated** - Smooth animations

## 📱 Screenshots

*Coming soon - add screenshots of dust bunnies in action!*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Acknowledgments

- Inspired by the universal experience of notification overload
- Built with love for procrastinators everywhere
- Special thanks to all the ignored notifications that sparked this idea

---

*Made with 💜 and a healthy dose of notification anxiety*
