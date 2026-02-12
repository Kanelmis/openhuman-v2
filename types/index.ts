// ==================== USER ====================
export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  avatarUrl?: string;
  headline?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  hourlyRate: number;
  currency: string;
  walletAddress?: string;
  isAvailable: boolean;
  isVerified: boolean;
  rating: number;
  totalTasks: number;
  totalEarned: number;
  skills: string[];
  languages: string[];
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  reviews: Review[];
  completedTasks: Task[];
}

// ==================== TASK / OPPORTUNITY ====================
export type TaskStatus = 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';
export type TaskCategory =
  | 'pickup_delivery'
  | 'meeting'
  | 'document_signing'
  | 'recon'
  | 'verification'
  | 'event_attendance'
  | 'hardware_setup'
  | 'real_estate'
  | 'product_testing'
  | 'errands'
  | 'photography'
  | 'purchases'
  | 'other';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  budget: number;
  currency: string;
  location?: string;
  isRemote: boolean;
  requiredSkills: string[];
  deadline?: string;
  createdBy: string;
  createdByAgent?: string;
  assignedTo?: string;
  applicants: string[];
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface TaskApplication {
  id: string;
  taskId: string;
  userId: string;
  proposal: string;
  proposedRate: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// ==================== BOOKING ====================
export interface Booking {
  id: string;
  taskId: string;
  humanId: string;
  agentId?: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  startTime: string;
  endTime?: string;
  totalAmount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== PAYMENTS ====================
export type PaymentMethod =
  | 'usdc_ethereum'
  | 'usdc_polygon'
  | 'usdc_base'
  | 'usdt_erc20'
  | 'usdt_trc20'
  | 'eth'
  | 'btc'
  | 'sol'
  | 'matic'
  | 'wechat_pay'
  | 'alipay'
  | 'unionpay'
  | 'bank_transfer';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface PaymentTransaction {
  id: string;
  bookingId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  txHash?: string;
  chainId?: number;
  walletAddress?: string;
  qrCodeUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  completedAt?: string;
}

export interface WalletBalance {
  currency: string;
  available: number;
  pending: number;
  total: number;
}

// ==================== REVIEWS ====================
export interface Review {
  id: string;
  taskId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// ==================== REFERRALS ====================
export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  code: string;
  status: 'pending' | 'completed' | 'expired';
  reward: number;
  createdAt: string;
  completedAt?: string;
}

// ==================== NOTIFICATIONS ====================
export interface Notification {
  id: string;
  userId: string;
  type: 'task_assigned' | 'task_completed' | 'payment_received' | 'new_application' | 'review' | 'referral' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
}

// ==================== EARNINGS ====================
export interface EarningsSummary {
  totalEarned: number;
  thisMonth: number;
  lastMonth: number;
  pendingPayouts: number;
  tasksCompleted: number;
  averageRating: number;
  topSkill: string;
  earningsByMonth: { month: string; amount: number }[];
  earningsByCategory: { category: string; amount: number }[];
  recentTransactions: PaymentTransaction[];
}

// ==================== API ====================
export interface ApiKey {
  id: string;
  key: string;
  name: string;
  userId: string;
  permissions: string[];
  rateLimit: number;
  isActive: boolean;
  createdAt: string;
  lastUsedAt?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== FILTERS ====================
export interface ExploreFilters {
  search: string;
  category: TaskCategory | 'all';
  sortBy: 'newest' | 'priority' | 'trending' | 'highest_pay' | 'referral';
  location: string;
  minBudget: number;
  maxBudget: number;
  isRemote: boolean;
  skills: string[];
}

// ==================== STATS ====================
export interface PlatformStats {
  totalHumans: number;
  totalTasks: number;
  totalCompleted: number;
  totalPaidOut: number;
  activeAgents: number;
  countriesServed: number;
}

// ==================== CATEGORY METADATA ====================
export const TASK_CATEGORIES: Record<TaskCategory, { emoji: string; label: string; color: string }> = {
  pickup_delivery: { emoji: '📦', label: 'Pickups & Delivery', color: '#f59e0b' },
  meeting: { emoji: '🤝', label: 'In-Person Meetings', color: '#3b82f6' },
  document_signing: { emoji: '✍️', label: 'Document Signing', color: '#8b5cf6' },
  recon: { emoji: '🔍', label: 'Reconnaissance', color: '#ef4444' },
  verification: { emoji: '👀', label: 'Verification', color: '#10b981' },
  event_attendance: { emoji: '🎪', label: 'Event Attendance', color: '#f97316' },
  hardware_setup: { emoji: '🔧', label: 'Hardware Setup', color: '#6366f1' },
  real_estate: { emoji: '🏠', label: 'Real Estate', color: '#14b8a6' },
  product_testing: { emoji: '🧪', label: 'Product Testing', color: '#ec4899' },
  errands: { emoji: '🏃', label: 'Errands', color: '#eab308' },
  photography: { emoji: '📸', label: 'Photography', color: '#a855f7' },
  purchases: { emoji: '🛒', label: 'Purchases', color: '#06b6d4' },
  other: { emoji: '📋', label: 'Other', color: '#64748b' },
};

export const SKILLS = [
  'Driving', 'Photography', 'Videography', 'Data Entry', 'Research',
  'Translation', 'Writing', 'Social Media', 'Event Planning', 'Cooking',
  'Cleaning', 'Moving', 'Assembly', 'Tech Support', 'Customer Service',
  'Sales', 'Marketing', 'Design', 'Programming', 'Accounting',
  'Legal', 'Medical', 'Teaching', 'Tutoring', 'Pet Care',
  'Gardening', 'Handyman', 'Plumbing', 'Electrical', 'Painting',
] as const;
