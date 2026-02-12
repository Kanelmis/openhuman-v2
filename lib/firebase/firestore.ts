import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, startAfter, Timestamp,
  type DocumentData, type QueryConstraint, increment,
} from 'firebase/firestore';
import { db } from './config';
import type { User, Task, Booking, PaymentTransaction, Review, Referral, Notification, TaskApplication } from '@/types';
import { v4 as uuid } from 'uuid';

// ==================== USERS ====================
export const usersRef = collection(db, 'users');

export async function createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  const id = uuid();
  const now = new Date().toISOString();
  const user: User = { id, ...data, createdAt: now, updatedAt: now };
  await setDoc(doc(db, 'users', id), user);
  return user;
}

export async function getUser(id: string): Promise<User | null> {
  const snap = await getDoc(doc(db, 'users', id));
  return snap.exists() ? (snap.data() as User) : null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const q = query(usersRef, where('email', '==', email), limit(1));
  const snap = await getDocs(q);
  return snap.empty ? null : (snap.docs[0].data() as User);
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const q = query(usersRef, where('username', '==', username), limit(1));
  const snap = await getDocs(q);
  return snap.empty ? null : (snap.docs[0].data() as User);
}

export async function updateUser(id: string, data: Partial<User>): Promise<void> {
  await updateDoc(doc(db, 'users', id), { ...data, updatedAt: new Date().toISOString() });
}

export async function searchUsers(filters: {
  skills?: string[];
  location?: string;
  minRate?: number;
  maxRate?: number;
  isAvailable?: boolean;
  sortBy?: string;
  pageSize?: number;
}): Promise<User[]> {
  const constraints: QueryConstraint[] = [];
  if (filters.isAvailable !== undefined) constraints.push(where('isAvailable', '==', filters.isAvailable));
  if (filters.location) constraints.push(where('location', '==', filters.location));
  constraints.push(orderBy('rating', 'desc'));
  if (filters.pageSize) constraints.push(limit(filters.pageSize));

  const q = query(usersRef, ...constraints);
  const snap = await getDocs(q);
  let users = snap.docs.map(d => d.data() as User);

  if (filters.skills?.length) {
    users = users.filter(u => filters.skills!.some(s => u.skills.includes(s)));
  }
  if (filters.minRate) users = users.filter(u => u.hourlyRate >= filters.minRate!);
  if (filters.maxRate) users = users.filter(u => u.hourlyRate <= filters.maxRate!);

  return users;
}

// ==================== TASKS ====================
export const tasksRef = collection(db, 'tasks');

export async function createTask(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'applicants'>): Promise<Task> {
  const id = uuid();
  const now = new Date().toISOString();
  const task: Task = { id, ...data, applicants: [], createdAt: now, updatedAt: now };
  await setDoc(doc(db, 'tasks', id), task);
  return task;
}

export async function getTask(id: string): Promise<Task | null> {
  const snap = await getDoc(doc(db, 'tasks', id));
  return snap.exists() ? (snap.data() as Task) : null;
}

export async function updateTask(id: string, data: Partial<Task>): Promise<void> {
  await updateDoc(doc(db, 'tasks', id), { ...data, updatedAt: new Date().toISOString() });
}

export async function searchTasks(filters: {
  category?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  location?: string;
  minBudget?: number;
  maxBudget?: number;
  isRemote?: boolean;
  skills?: string[];
  pageSize?: number;
}): Promise<Task[]> {
  const constraints: QueryConstraint[] = [where('isPublic', '==', true)];
  if (filters.status) constraints.push(where('status', '==', filters.status));
  if (filters.category && filters.category !== 'all') constraints.push(where('category', '==', filters.category));
  if (filters.isRemote !== undefined) constraints.push(where('isRemote', '==', filters.isRemote));
  constraints.push(orderBy('createdAt', 'desc'));
  if (filters.pageSize) constraints.push(limit(filters.pageSize));

  const q = query(tasksRef, ...constraints);
  const snap = await getDocs(q);
  let tasks = snap.docs.map(d => d.data() as Task);

  if (filters.search) {
    const s = filters.search.toLowerCase();
    tasks = tasks.filter(t => t.title.toLowerCase().includes(s) || t.description.toLowerCase().includes(s));
  }
  if (filters.minBudget) tasks = tasks.filter(t => t.budget >= filters.minBudget!);
  if (filters.maxBudget) tasks = tasks.filter(t => t.budget <= filters.maxBudget!);

  return tasks;
}

export async function getUserTasks(userId: string, role: 'created' | 'assigned'): Promise<Task[]> {
  const field = role === 'created' ? 'createdBy' : 'assignedTo';
  const q = query(tasksRef, where(field, '==', userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Task);
}

// ==================== BOOKINGS ====================
export const bookingsRef = collection(db, 'bookings');

export async function createBooking(data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
  const id = uuid();
  const now = new Date().toISOString();
  const booking: Booking = { id, ...data, createdAt: now, updatedAt: now };
  await setDoc(doc(db, 'bookings', id), booking);
  return booking;
}

export async function getBooking(id: string): Promise<Booking | null> {
  const snap = await getDoc(doc(db, 'bookings', id));
  return snap.exists() ? (snap.data() as Booking) : null;
}

export async function updateBooking(id: string, data: Partial<Booking>): Promise<void> {
  await updateDoc(doc(db, 'bookings', id), { ...data, updatedAt: new Date().toISOString() });
}

// ==================== PAYMENTS ====================
export const paymentsRef = collection(db, 'payments');

export async function createPayment(data: Omit<PaymentTransaction, 'id' | 'createdAt'>): Promise<PaymentTransaction> {
  const id = uuid();
  const now = new Date().toISOString();
  const payment: PaymentTransaction = { id, ...data, createdAt: now };
  await setDoc(doc(db, 'payments', id), payment);
  return payment;
}

export async function getUserPayments(userId: string): Promise<PaymentTransaction[]> {
  const q = query(paymentsRef, where('toUserId', '==', userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as PaymentTransaction);
}

// ==================== REVIEWS ====================
export const reviewsRef = collection(db, 'reviews');

export async function createReview(data: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  const id = uuid();
  const review: Review = { id, ...data, createdAt: new Date().toISOString() };
  await setDoc(doc(db, 'reviews', id), review);
  return review;
}

export async function getUserReviews(userId: string): Promise<Review[]> {
  const q = query(reviewsRef, where('revieweeId', '==', userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Review);
}

// ==================== REFERRALS ====================
export const referralsRef = collection(db, 'referrals');

export async function createReferral(data: Omit<Referral, 'id' | 'createdAt'>): Promise<Referral> {
  const id = uuid();
  const referral: Referral = { id, ...data, createdAt: new Date().toISOString() };
  await setDoc(doc(db, 'referrals', id), referral);
  return referral;
}

// ==================== NOTIFICATIONS ====================
export const notificationsRef = collection(db, 'notifications');

export async function createNotification(data: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Promise<Notification> {
  const id = uuid();
  const notification: Notification = { id, ...data, isRead: false, createdAt: new Date().toISOString() };
  await setDoc(doc(db, 'notifications', id), notification);
  return notification;
}

export async function getUserNotifications(userId: string): Promise<Notification[]> {
  const q = query(notificationsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Notification);
}

export async function markNotificationRead(id: string): Promise<void> {
  await updateDoc(doc(db, 'notifications', id), { isRead: true });
}

// ==================== STATS ====================
export async function getPlatformStats() {
  const [usersSnap, tasksSnap] = await Promise.all([
    getDocs(query(usersRef, limit(1000))),
    getDocs(query(tasksRef, limit(1000))),
  ]);
  const tasks = tasksSnap.docs.map(d => d.data() as Task);
  const completed = tasks.filter(t => t.status === 'completed');
  return {
    totalHumans: usersSnap.size,
    totalTasks: tasksSnap.size,
    totalCompleted: completed.length,
    totalPaidOut: completed.reduce((sum, t) => sum + t.budget, 0),
    activeAgents: 42,
    countriesServed: 28,
  };
}
