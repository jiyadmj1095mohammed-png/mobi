export type UserRole = "student" | "admin" | "moderator";

export interface UserProfile {
  id: string;
  email?: string;
  fullName: string;
  department: string;
  role: UserRole;
  isGuest: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface UserWallet {
  userId: string;
  mobiCoins: number;   // Earned strictly via approved Eco reports. Spent on Event discounts.
  chatPoints: number;  // Earned strictly via Civic Quizzes. Spent on Random Chat sessions.
  updatedAt: string;
}

export type CurrencyType = "mobi_coin" | "chat_point";
export type TransactionAction = "earned" | "spent" | "locked" | "refunded";

export interface WalletTransaction {
  id: string;
  userId: string;
  currency: CurrencyType;
  amount: number;
  action: TransactionAction;
  description: string;
  referenceId?: string;
  createdAt: string;
}

export type ReportCategory =
  | "overflowing"
  | "improper_dumping"
  | "damaged_bin"
  | "unclean_area"
  | "other";

export type ReportStatus = "pending" | "reviewed" | "approved" | "rejected";

export interface WasteReport {
  id: string;
  userId: string;
  userName: string;
  binId?: string;
  category: ReportCategory;
  locationName: string;
  description: string;
  photoUrl?: string;
  status: ReportStatus;
  rewardAmount: number; // typically 15 Mobi Coins
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type BinCategory = "general" | "dry" | "wet" | "plastic" | "ewaste";
export type BinCondition = "good" | "moderate" | "full" | "damaged";

export interface WasteBin {
  id: string;
  category: BinCategory;
  locationName: string;
  pos: [number, number]; // [x, y] in normalized map coordinates
  condition: BinCondition;
  verified: boolean;
  lastServiced: string;
}

export interface EcoQuizQuestion {
  id: string;
  itemName: string;
  icon: string;
  options: [string, string]; // 2 options initially as specified
  correctIndex: number;
  explanation: string;
  difficulty: "easy" | "medium";
}

export interface CivicQuizQuestion {
  id: string;
  question: string;
  options: [string, string, string]; // 3 options as specified
  correctIndex: number;
  explanation: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  department: string;
  club?: string;
  date: string;
  time: string;
  venue: string;
  fee: number; // in INR
  organizer: string;
  registrationDeadline: string;
  totalSeats: number;
  registeredCount: number;
  maxCoinDiscount: number; // in Mobi Coins (1 coin = 1 INR)
  imageUrl: string;
  status: "upcoming" | "ongoing" | "completed";
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userName: string;
  originalFee: number;
  coinsUsed: number;
  discountAmount: number;
  finalPaid: number;
  status: "confirmed" | "cancelled";
  createdAt: string;
}

export interface ChatSession {
  id: string;
  participantA: string;
  participantB: string;
  participantAName: string;
  participantBName: string;
  participantADept: string;
  participantBDept: string;
  status: "matching" | "active" | "ended";
  createdAt: string;
  endedAt?: string;
}

export interface EphemeralMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  delivered: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: "official" | "club" | "campaign" | "opportunity";
  department?: string;
  author: string;
  pinned: boolean;
  createdAt: string;
}
