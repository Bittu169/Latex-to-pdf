import { ProjectFile, ProjectMetadata } from '../types/latex';

export interface ProjectSnapshot {
  id: string;
  name: string;
  timestamp: number;
  files: ProjectFile[];
  metadata: ProjectMetadata;
  description?: string;
  fileCount: number;
}

const DB_NAME = 'LaTeXStudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'snapshots';

/**
 * Initializes and opens the IndexedDB database.
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is not supported by your browser.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB.'));
    };
  });
}

/**
 * Saves a new project snapshot to IndexedDB.
 */
export async function saveSnapshot(
  name: string,
  files: ProjectFile[],
  metadata: ProjectMetadata,
  description?: string
): Promise<ProjectSnapshot> {
  const db = await openDB();

  const snapshot: ProjectSnapshot = {
    id: `snap_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim() || `Snapshot ${new Date().toLocaleString()}`,
    timestamp: Date.now(),
    files: JSON.parse(JSON.stringify(files)),
    metadata: JSON.parse(JSON.stringify(metadata)),
    description: description?.trim(),
    fileCount: files.length
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.add(snapshot);

    request.onsuccess = () => resolve(snapshot);
    request.onerror = () => reject(request.error || new Error('Failed to save snapshot.'));
  });
}

/**
 * Retrieves all saved project snapshots ordered by newest first.
 */
export async function getAllSnapshots(): Promise<ProjectSnapshot[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const results: ProjectSnapshot[] = request.result || [];
      // Sort newest first
      results.sort((a, b) => b.timestamp - a.timestamp);
      resolve(results);
    };

    request.onerror = () => reject(request.error || new Error('Failed to retrieve snapshots.'));
  });
}

/**
 * Deletes a snapshot by ID from IndexedDB.
 */
export async function deleteSnapshot(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error || new Error('Failed to delete snapshot.'));
  });
}

/**
 * Retrieves a single snapshot by ID.
 */
export async function getSnapshotById(id: string): Promise<ProjectSnapshot | null> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error || new Error('Failed to get snapshot.'));
  });
}
