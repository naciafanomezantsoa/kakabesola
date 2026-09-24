import { DatePlan, PersonName } from '../types';
import { INITIAL_PLANS } from '../data/dateOptions';

const STORAGE_KEY = 'charobidy_baeko_plans_v2';
const CURRENT_PERSON_KEY = 'charobidy_baeko_person_v2';

export function getStoredPlans(): DatePlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PLANS));
      return INITIAL_PLANS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function clearAllPlans(): DatePlan[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (e) {
    console.error('Failed to clear localStorage', e);
  }
  return [];
}

export function resetDefaultPlans(): DatePlan[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PLANS));
  } catch (e) {
    console.error('Failed to reset default plans', e);
  }
  return INITIAL_PLANS;
}

export function savePlan(plan: DatePlan): DatePlan[] {
  const current = getStoredPlans();
  const updated = [plan, ...current.filter((p) => p.id !== plan.id)];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
  return updated;
}

export function deletePlan(id: string): DatePlan[] {
  const current = getStoredPlans();
  const updated = current.filter((p) => p.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete from localStorage', e);
  }
  return updated;
}

export function updatePlanStatus(id: string, status: DatePlan['status']): DatePlan[] {
  const current = getStoredPlans();
  const updated = current.map((p) => (p.id === id ? { ...p, status } : p));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update status', e);
  }
  return updated;
}

export function getStoredRespondent(): PersonName {
  try {
    const raw = localStorage.getItem(CURRENT_PERSON_KEY);
    if (raw === 'Nacia' || raw === 'Charobidy') {
      return raw;
    }
  } catch {
    // fallback
  }
  return 'Nacia';
}

export function setStoredRespondent(name: PersonName): void {
  try {
    localStorage.setItem(CURRENT_PERSON_KEY, name);
  } catch {
    // ignore
  }
}

export function formatDateFrench(dateString: string): string {
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}
