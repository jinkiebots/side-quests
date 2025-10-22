export interface NotificationData {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  appName: string;
  ignored: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface DustBunny {
  id: string;
  position: Position;
  velocity: Velocity;
  size: number;
  personality: DustBunnyPersonality;
  originalNotification: NotificationData;
  age: number; // How long it's been ignored (in minutes)
  alliances: string[]; // IDs of other dust bunnies it's allied with
  lastGossipTime: number;
  isGossiping: boolean;
  gossipText?: string;
  opacity: number;
  isBeingCollected: boolean;
}

export interface DustBunnyPersonality {
  type: 'mischievous' | 'shy' | 'chatty' | 'grumpy' | 'friendly';
  movementSpeed: number;
  gossipFrequency: number; // How often they gossip (higher = more frequent)
  alliancePreference: number; // How likely to form alliances (0-1)
  collectResistance: number; // How hard they are to collect (0-1)
}

export interface Alliance {
  id: string;
  members: string[];
  formationTime: number;
  currentGossip?: string;
  strength: number; // How strong the alliance is (affects movement together)
}

export const DUST_BUNNY_PERSONALITIES: Record<DustBunnyPersonality['type'], Omit<DustBunnyPersonality, 'type'>> = {
  mischievous: {
    movementSpeed: 1.5,
    gossipFrequency: 0.8,
    alliancePreference: 0.6,
    collectResistance: 0.9,
  },
  shy: {
    movementSpeed: 0.5,
    gossipFrequency: 0.2,
    alliancePreference: 0.3,
    collectResistance: 0.4,
  },
  chatty: {
    movementSpeed: 1.0,
    gossipFrequency: 0.9,
    alliancePreference: 0.8,
    collectResistance: 0.5,
  },
  grumpy: {
    movementSpeed: 0.7,
    gossipFrequency: 0.6,
    alliancePreference: 0.2,
    collectResistance: 0.8,
  },
  friendly: {
    movementSpeed: 1.2,
    gossipFrequency: 0.7,
    alliancePreference: 0.9,
    collectResistance: 0.3,
  },
};
