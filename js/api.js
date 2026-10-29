/**
 * API Module - StudentHub
 * Fetches JSON datasets with localStorage caching for mutations
 */

export const SOURCES = {
  events:    './data/events.json',
  students:  './data/students.json',
  courses:   './data/courses.json',
  faqs:      './data/faqs.json',
  inquiries: './data/inquiries.json'
};

const CACHE = {
  events:    'sh_events',
  students:  'sh_students',
  courses:   'sh_courses',
  faqs:      'sh_faqs',
  inquiries: 'sh_inquiries'
};

/** Fetch dataset — returns from localStorage override if present, else JSON file */
export async function fetchDataset(type) {
  const key = CACHE[type];
  if (key) {
    const local = localStorage.getItem(key);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { localStorage.removeItem(key); }
    }
  }

  await new Promise(r => setTimeout(r, 120)); // small UX delay

  const url = SOURCES[type];
  if (!url) throw new Error(`Unknown dataset: ${type}`);

  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} — could not load ${url}`);

  const data = await res.json();
  if (!Array.isArray(data)) throw new Error(`Expected array for ${type}`);

  if (key) localStorage.setItem(key, JSON.stringify(data));
  return data;
}

/** Persist mutations to localStorage */
export function saveLocal(type, data) {
  const key = CACHE[type];
  if (key) localStorage.setItem(key, JSON.stringify(data));
}
