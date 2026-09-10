import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { AppState } from '@/types';

interface FinEduDB extends DBSchema {
  appstate: {
    key: string;
    value: AppState;
  };
}

const DB_NAME = 'finedu-wallet';
const DB_VERSION = 1;
const STATE_KEY = 'main';

let dbPromise: Promise<IDBPDatabase<FinEduDB>> | null = null;

/** Solicita ao navegador que preserve os dados locais do app quando suportado. */
export async function requestPersistentStorage(): Promise<boolean> {
  if (!('storage' in navigator) || !navigator.storage.persist) return false;
  try {
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<FinEduDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('appstate')) {
          db.createObjectStore('appstate');
        }
      },
    });
  }
  return dbPromise;
}

export async function loadState(): Promise<AppState | null> {
  const db = await getDB();
  const result = await db.get('appstate', STATE_KEY);
  return result ?? null;
}

export async function saveState(state: AppState): Promise<void> {
  const db = await getDB();
  await db.put('appstate', state, STATE_KEY);
}

export async function clearState(): Promise<void> {
  const db = await getDB();
  await db.delete('appstate', STATE_KEY);
}
