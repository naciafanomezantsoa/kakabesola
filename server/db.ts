import fs from 'fs';
import path from 'path';
import type { DatePlan, CoupleNote } from '../src/types.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'couples_db.json');

export interface DatabaseSchema {
  plans: DatePlan[];
  notes: CoupleNote[];
  updatedAt: string;
}

const DEFAULT_PLANS: DatePlan[] = [
  {
    id: 'plan-initial-1',
    createdAt: new Date().toISOString(),
    proposer: 'Charobidy',
    respondent: 'Nacia',
    date: '2026-10-14',
    time: '20:00',
    activities: [
      'plan kaly 🍜',
      'regarder un film',
      'dormir',
      'dormir sans main',
    ],
    specialNote: 'Notre premier rendez-vous parfait et complice à deux ❤️',
    dodgeCount: 4,
    status: 'confirmé',
    place: 'Notre cocon secret',
  },
];

const DEFAULT_NOTES: CoupleNote[] = [
  {
    id: 'note-1',
    author: 'Charobidy',
    content: 'Toujours avoir une glace au chocolat au congélateur pour nos soirées films ! 🍨',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'note-2',
    author: 'Nacia',
    content: 'Ne jamais oublier de se faire un bisou du matin, même quand on est pressés 💕',
    createdAt: new Date().toISOString(),
  },
];

// Ensure DB directory and file exist
function initDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      plans: DEFAULT_PLANS,
      notes: DEFAULT_NOTES,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading DB, resetting to defaults:', err);
    const fallback: DatabaseSchema = {
      plans: DEFAULT_PLANS,
      notes: DEFAULT_NOTES,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    data.updatedAt = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write to database file:', err);
  }
}

export const db = {
  getPlans(): DatePlan[] {
    const data = initDb();
    return data.plans;
  },

  getPlanById(id: string): DatePlan | undefined {
    const data = initDb();
    return data.plans.find((p) => p.id === id);
  },

  savePlan(newPlan: DatePlan): DatePlan {
    const data = initDb();
    const existingIndex = data.plans.findIndex((p) => p.id === newPlan.id);

    if (existingIndex >= 0) {
      data.plans[existingIndex] = newPlan;
    } else {
      data.plans.unshift(newPlan);
    }

    writeDb(data);
    return newPlan;
  },

  updatePlanStatus(id: string, status: DatePlan['status']): DatePlan | null {
    const data = initDb();
    const plan = data.plans.find((p) => p.id === id);
    if (!plan) return null;

    plan.status = status;
    writeDb(data);
    return plan;
  },

  deletePlan(id: string): boolean {
    const data = initDb();
    const initialLen = data.plans.length;
    data.plans = data.plans.filter((p) => p.id !== id);
    if (data.plans.length !== initialLen) {
      writeDb(data);
      return true;
    }
    return false;
  },

  clearAllPlans(): void {
    const data = initDb();
    data.plans = [];
    writeDb(data);
  },

  resetDefaults(): DatePlan[] {
    const data = initDb();
    data.plans = DEFAULT_PLANS;
    data.notes = DEFAULT_NOTES;
    writeDb(data);
    return DEFAULT_PLANS;
  },

  getNotes(): CoupleNote[] {
    const data = initDb();
    return data.notes || [];
  },

  addNote(author: DatePlan['proposer'], content: string): CoupleNote {
    const data = initDb();
    const newNote: CoupleNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      author: author || 'Charobidy',
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    data.notes = [newNote, ...(data.notes || [])];
    writeDb(data);
    return newNote;
  },

  deleteNote(id: string): boolean {
    const data = initDb();
    const initialLen = (data.notes || []).length;
    data.notes = (data.notes || []).filter((n) => n.id !== id);
    if (data.notes.length !== initialLen) {
      writeDb(data);
      return true;
    }
    return false;
  },
};
