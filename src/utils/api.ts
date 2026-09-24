import { DatePlan, CoupleNote, PersonName } from '../types';
import {
  getStoredPlans,
  savePlan as saveLocalPlan,
  deletePlan as deleteLocalPlan,
  clearAllPlans as clearLocalPlans,
  updatePlanStatus as updateLocalPlanStatus,
  resetDefaultPlans as resetLocalDefaults,
} from './storage';

const API_BASE = '/api';

export async function fetchPlansFromServer(): Promise<DatePlan[]> {
  try {
    const res = await fetch(`${API_BASE}/plans`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      // Sync local cache
      try {
        localStorage.setItem('charobidy_baeko_plans_v2', JSON.stringify(json.data));
      } catch (e) {
        // ignore
      }
      return json.data;
    }
  } catch (err) {
    console.warn('API unavailable, using local cache:', err);
  }
  return getStoredPlans();
}

export async function createPlanOnServer(plan: DatePlan): Promise<DatePlan> {
  // Optimistically update local
  saveLocalPlan(plan);

  try {
    const res = await fetch(`${API_BASE}/plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Failed to sync plan to server, stored locally:', err);
  }
  return plan;
}

export async function updatePlanStatusOnServer(
  id: string,
  status: DatePlan['status']
): Promise<DatePlan[]> {
  updateLocalPlanStatus(id, status);

  try {
    await fetch(`${API_BASE}/plans/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  } catch (err) {
    console.warn('Failed to update status on server:', err);
  }
  return getStoredPlans();
}

export async function deletePlanOnServer(id: string): Promise<DatePlan[]> {
  deleteLocalPlan(id);

  try {
    await fetch(`${API_BASE}/plans/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.warn('Failed to delete on server:', err);
  }
  return getStoredPlans();
}

export async function clearAllPlansOnServer(): Promise<DatePlan[]> {
  clearLocalPlans();

  try {
    await fetch(`${API_BASE}/plans`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.warn('Failed to clear on server:', err);
  }
  return [];
}

export async function resetDefaultPlansOnServer(): Promise<DatePlan[]> {
  try {
    const res = await fetch(`${API_BASE}/plans/reset`, {
      method: 'POST',
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        try {
          localStorage.setItem('charobidy_baeko_plans_v2', JSON.stringify(json.data));
        } catch (e) {
          // ignore
        }
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Failed to reset on server:', err);
  }
  return resetLocalDefaults();
}

export async function fetchNotesFromServer(): Promise<CoupleNote[]> {
  try {
    const res = await fetch(`${API_BASE}/notes`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch notes from server:', err);
  }

  // Fallback to local
  try {
    const saved = localStorage.getItem('charobidy_couple_notes_v3');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export async function addNoteOnServer(author: PersonName, content: string): Promise<CoupleNote> {
  const tempNote: CoupleNote = {
    id: `note-${Date.now()}`,
    author,
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, content: content.trim() }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Failed to add note to server:', err);
  }
  return tempNote;
}

export async function deleteNoteOnServer(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.warn('Failed to delete note on server:', err);
    return false;
  }
}
