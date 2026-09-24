export type PersonName = 'Nacia' | 'Charobidy';

export interface CoupleNote {
  id: string;
  author: PersonName;
  content: string;
  createdAt: string;
}

export interface DateActivity {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: 'food' | 'rest' | 'fun' | 'intimate';
}

export interface DatePlan {
  id: string;
  createdAt: string;
  proposer: PersonName;
  respondent: PersonName;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  activities: string[]; // Activity names or IDs
  specialNote?: string;
  dodgeCount: number;
  status: 'confirmé' | 'terminé' | 'en_attente';
  place?: string;
}

export type AppView = 'proposal' | 'planner' | 'letter' | 'dashboard';
