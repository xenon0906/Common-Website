import { vi } from 'vitest'

export const mockFirestore = {
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  setDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  where: vi.fn(),
  serverTimestamp: vi.fn(() => new Date().toISOString()),
  writeBatch: vi.fn(() => ({
    set: vi.fn(),
    delete: vi.fn(),
    commit: vi.fn(),
  })),
}

vi.mock('firebase/firestore', () => mockFirestore)

vi.mock('@/lib/firebase-server', () => ({
  getServerDb: vi.fn(() => ({})),
  getServerAppId: vi.fn(() => 'test-app'),
  isFirebaseConfigured: vi.fn(() => true),
  getFirestoreDocument: vi.fn(),
  getFirestoreCollection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  collection: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  where: vi.fn(),
}))
