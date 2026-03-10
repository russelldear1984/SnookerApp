import { AppState } from './types';
import { seedState } from './seed';

const KEY = 'gsm.v1.state';

export const loadState = (): AppState => {
  if (typeof window === 'undefined') return seedState;
  const raw = localStorage.getItem(KEY);
  if (!raw) return seedState;
  try { return JSON.parse(raw) as AppState; } catch { return seedState; }
};

export const saveState = (state: AppState) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(state));
};
