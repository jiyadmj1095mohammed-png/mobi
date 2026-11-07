"use client";

import { useEffect, useState } from "react";
import {
  UserProfile,
  UserWallet,
  WalletTransaction,
  WasteReport,
  WasteBin,
  CampusEvent,
  EventRegistration,
  ChatSession,
  Announcement,
  EcoQuizQuestion,
  CivicQuizQuestion,
  ReportCategory,
} from "@/types/database";

export interface ExtendedProfile extends UserProfile {
  isOnboarded: boolean;
}

const DEFAULT_PROFILE: ExtendedProfile = {
  id: "std-001",
  email: "student@meaec.edu.in",
  fullName: "",
  department: "",
  role: "student",
  isGuest: false,
  isOnboarded: false,
  createdAt: new Date().toISOString(),
};

const INITIAL_WALLET: UserWallet = {
  userId: "std-001",
  mobiCoins: 0,
  chatPoints: 4,
  updatedAt: new Date().toISOString(),
};

const INITIAL_TRANSACTIONS: WalletTransaction[] = [];

export const INITIAL_BINS: WasteBin[] = [
  { id: "BIN-001", category: "general", locationName: "Main Entrance Gate", pos: [-36, -5.8], condition: "good", verified: true, lastServiced: "Today, 08:00 AM" },
  { id: "BIN-002", category: "dry", locationName: "Main Gate Walkway", pos: [-34, -5.8], condition: "good", verified: true, lastServiced: "Today, 08:00 AM" },
  { id: "BIN-003", category: "wet", locationName: "Campus Garden Path", pos: [-32, -5.8], condition: "moderate", verified: true, lastServiced: "Yesterday" },
  { id: "BIN-004", category: "general", locationName: "Main Block Porch", pos: [-5.2, 9], condition: "good", verified: true, lastServiced: "Today, 10:30 AM" },
  { id: "BIN-005", category: "dry", locationName: "Main Block East Quad", pos: [-4, 10.5], condition: "full", verified: true, lastServiced: "2 days ago" },
  { id: "BIN-006", category: "wet", locationName: "Canteen Area South", pos: [-12.8, 15.5], condition: "good", verified: true, lastServiced: "Today, 11:00 AM" },
  { id: "BIN-007", category: "general", locationName: "Auditorium Front", pos: [-3.5, 28.5], condition: "good", verified: true, lastServiced: "Yesterday" },
  { id: "BIN-008", category: "dry", locationName: "Auditorium West Steps", pos: [-2, 31.5], condition: "moderate", verified: true, lastServiced: "Today, 09:00 AM" },
  { id: "BIN-009", category: "plastic", locationName: "Auditorium Quadrangle", pos: [3, 26], condition: "good", verified: true, lastServiced: "Today, 08:30 AM" },
  { id: "BIN-010", category: "general", locationName: "Men's Hostel Gate", pos: [35.5, 3], condition: "good", verified: true, lastServiced: "Today, 07:30 AM" },
  { id: "BIN-011", category: "wet", locationName: "Men's Hostel Dining", pos: [37.5, 4.5], condition: "full", verified: true, lastServiced: "Yesterday" },
  { id: "BIN-012", category: "ewaste", locationName: "Hostel Study Hall", pos: [34, -3], condition: "good", verified: true, lastServiced: "4 days ago" },
  { id: "BIN-013", category: "plastic", locationName: "Mechanical Workshop Yard", pos: [19.5, 19], condition: "good", verified: true, lastServiced: "Today, 09:15 AM" },
  { id: "BIN-014", category: "ewaste", locationName: "FabLab Workshop Lobby", pos: [23, 23], condition: "moderate", verified: true, lastServiced: "3 days ago" },
  { id: "BIN-015", category: "general", locationName: "Civil Block Ground Floor", pos: [23, -15], condition: "good", verified: true, lastServiced: "Today, 08:45 AM" },
  { id: "BIN-016", category: "dry", locationName: "Civil Survey Lab Path", pos: [25, -14], condition: "good", verified: true, lastServiced: "Today, 08:45 AM" },
  { id: "BIN-017", category: "plastic", locationName: "Civil Block Porch", pos: [15, -14], condition: "good", verified: true, lastServiced: "Yesterday" },
  { id: "BIN-018", category: "plastic", locationName: "Playfield Pavilion", pos: [-17.5, -5], condition: "damaged", verified: true, lastServiced: "5 days ago" },
  { id: "BIN-019", category: "general", locationName: "Central Circle", pos: [10, -9], condition: "good", verified: true, lastServiced: "Today, 10:00 AM" },
];

export const INITIAL_REPORTS: WasteReport[] = [];

export const ECO_QUIZ_QUESTIONS: EcoQuizQuestion[] = [
  {
    id: "eq-1",
    itemName: "Crushed Plastic Water Bottle",
    icon: "🍾",
    options: ["Dry Recyclables", "Wet Compost"],
    correctIndex: 0,
    explanation: "PET bottles go into dry recyclables after emptying.",
    difficulty: "easy",
  },
  {
    id: "eq-2",
    itemName: "Leftover Food Scraps",
    icon: "🍛",
    options: ["Wet Compost", "Dry Recyclables"],
    correctIndex: 0,
    explanation: "Organic food waste is compostable.",
    difficulty: "easy",
  },
  {
    id: "eq-3",
    itemName: "Cardboard Packaging Box",
    icon: "📦",
    options: ["Dry Recyclables", "Wet Compost"],
    correctIndex: 0,
    explanation: "Clean cardboard is recyclable.",
    difficulty: "easy",
  },
  {
    id: "eq-4",
    itemName: "Used Battery",
    icon: "🔋",
    options: ["E-Waste / Special", "Dry Waste"],
    correctIndex: 0,
    explanation: "Batteries require designated e-waste disposal.",
    difficulty: "medium",
  },
  {
    id: "eq-5",
    itemName: "Aluminum Soda Can",
    icon: "🥫",
    options: ["Dry Recyclables", "Wet Compost"],
    correctIndex: 0,
    explanation: "Metal cans are 100% recyclable.",
    difficulty: "easy",
  },
];

export const CIVIC_QUIZ_QUESTIONS: CivicQuizQuestion[] = [
  {
    id: "cq-1",
    question: "What is the expected conduct when chatting with fellow students on MOBI?",
    options: [
      "Mutual respect, helpful dialogue, and zero harassment.",
      "Sharing private account passwords or numbers.",
      "Promoting commercial ads.",
    ],
    correctIndex: 0,
    explanation: "MOBI is built for constructive student communication.",
  },
  {
    id: "cq-2",
    question: "You see an overflowing bin near the workshop. What should you do?",
    options: [
      "Submit a quick report on MOBI ECO so the grounds crew can resolve it.",
      "Leave more trash on the ground beside it.",
      "Ignore it completely.",
    ],
    correctIndex: 0,
    explanation: "Reporting verified issues creates an actionable ticket for facilities.",
  },
  {
    id: "cq-3",
    question: "How can Mobi Coins be used?",
    options: [
      "For ticket fee discounts on eligible campus events and fests.",
      "Withdrawn as personal cash.",
      "Sold to other students.",
    ],
    correctIndex: 0,
    explanation: "Mobi Coins provide event discounts and encourage campus care.",
  },
];

export const INITIAL_EVENTS: CampusEvent[] = [
  {
    id: "evt-past-01",
    title: "MEA Campus Green Marathon & Tree Drive",
    description: "Annual campus perimeter marathon and 100 native sapling plantation drive across MEA grounds.",
    department: "Physical Education & Nature Club",
    club: "Nature Club",
    date: "Nov 02, 2026",
    time: "06:30 AM - 10:30 AM",
    venue: "College Main Ground & Perimeter",
    fee: 0,
    organizer: "Nature Club & Sports Dept",
    registrationDeadline: "Nov 01, 2026",
    totalSeats: 150,
    registeredCount: 150,
    maxCoinDiscount: 0,
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    status: "completed",
  },
  {
    id: "evt-past-02",
    title: "S3 / S5 Academic Orientation & Code Sprint",
    description: "Hands-on software sprint and introduction to open-source student initiatives and developer tooling.",
    department: "Computer Science & Engineering",
    club: "FOSS MEA",
    date: "Nov 05, 2026",
    time: "10:00 AM - 04:00 PM",
    venue: "Main Block Auditorium",
    fee: 30,
    organizer: "Dept of CSE",
    registrationDeadline: "Nov 04, 2026",
    totalSeats: 120,
    registeredCount: 120,
    maxCoinDiscount: 15,
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80",
    status: "completed",
  },
  {
    id: "evt-01",
    title: "INNOVEX 2026: National Tech Symposium",
    description: "Premier inter-college engineering symposium featuring robotics hackathon, algorithmic challenges, and technical paper presentations.",
    department: "Computer Science & Engineering",
    club: "FOSS Chapter",
    date: "Nov 20, 2026",
    time: "09:30 AM - 05:00 PM",
    venue: "MEA Auditorium",
    fee: 60,
    organizer: "Dept of CSE",
    registrationDeadline: "Nov 18, 2026",
    totalSeats: 250,
    registeredCount: 84,
    maxCoinDiscount: 25,
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
    status: "upcoming",
  },
  {
    id: "evt-02",
    title: "Civil CAD, GIS & BIM Modeling Workshop",
    description: "Hands-on structural drafting and building information modeling lab session in Civil Block CAD Center.",
    department: "Civil Engineering",
    club: "ASCE Student Chapter",
    date: "Nov 25, 2026",
    time: "10:00 AM - 04:00 PM",
    venue: "Civil CAD Lab, Block C",
    fee: 50,
    organizer: "Civil Eng Association",
    registrationDeadline: "Nov 23, 2026",
    totalSeats: 50,
    registeredCount: 22,
    maxCoinDiscount: 20,
    imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80",
    status: "upcoming",
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-01",
    title: "Official Bus Schedule & Route 4 Update (SH39)",
    content: "Perinthalmanna - Nilambur campus shuttle buses will depart directly from MEA College Stop at 04:45 PM and 05:30 PM.",
    category: "official",
    department: "Transportation Office",
    author: "Transport Coordinator",
    pinned: true,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: "ann-02",
    title: "5 Serviced RO Drinking Water Points Now Live",
    content: "Purified RO water stations are now online at Main Block Porch, Auditorium Cafeteria, and Civil Department entrance.",
    category: "campaign",
    department: "Campus Facilities",
    author: "Operations Desk",
    pinned: false,
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: "ann-03",
    title: "Zero Single-Use Plastic Policy on Campus",
    content: "All students and staff are requested to utilize the segregated waste bins and campus water points. Single-use plastic cups are prohibited.",
    category: "official",
    department: "Campus Sustainability Council",
    author: "Green Committee",
    pinned: false,
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
];

export function useMobiStore() {
  const [profile, setProfile] = useState<ExtendedProfile>(DEFAULT_PROFILE);
  const [wallet, setWallet] = useState<UserWallet>(INITIAL_WALLET);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [reports, setReports] = useState<WasteReport[]>(INITIAL_REPORTS);
  const [bins, setBins] = useState<WasteBin[]>(INITIAL_BINS);
  const [events, setEvents] = useState<CampusEvent[]>(INITIAL_EVENTS);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("mobi_profile_v4");
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
      const savedWallet = localStorage.getItem("mobi_wallet_v4");
      if (savedWallet) setWallet(JSON.parse(savedWallet));
      const savedReports = localStorage.getItem("mobi_reports_v4");
      if (savedReports) setReports(JSON.parse(savedReports));
      const savedTransactions = localStorage.getItem("mobi_txs_v4");
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    } catch {
      // ignore
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveProfile = (fullName: string, department: string) => {
    const updated: ExtendedProfile = {
      ...profile,
      fullName,
      department,
      isOnboarded: true,
    };
    setProfile(updated);
    try {
      localStorage.setItem("mobi_profile_v4", JSON.stringify(updated));
    } catch {}
  };

  const submitWasteReport = (category: ReportCategory, locationName: string, description: string, binId?: string) => {
    const newReport: WasteReport = {
      id: `rep-${Date.now()}`,
      userId: profile.id,
      userName: profile.fullName || "Student",
      binId: binId || undefined,
      category,
      locationName,
      description,
      status: "pending",
      rewardAmount: 15,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newReport, ...reports];
    setReports(updated);
    try {
      localStorage.setItem("mobi_reports_v4", JSON.stringify(updated));
    } catch {}
    return newReport;
  };

  const reviewReport = (reportId: string, status: "approved" | "rejected", adminNotes: string) => {
    const report = reports.find((r) => r.id === reportId);
    if (!report || report.status === status) return;

    const updatedReports = reports.map((r) =>
      r.id === reportId ? { ...r, status, adminNotes, updatedAt: new Date().toISOString() } : r
    );

    let updatedWallet = { ...wallet };
    let updatedTxs = [...transactions];

    if (status === "approved" && report.status !== "approved") {
      updatedWallet = {
        ...updatedWallet,
        mobiCoins: updatedWallet.mobiCoins + report.rewardAmount,
        updatedAt: new Date().toISOString(),
      };
      const newTx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        userId: report.userId,
        currency: "mobi_coin",
        amount: report.rewardAmount,
        action: "earned",
        description: `Approved Report: ${report.locationName}`,
        referenceId: report.id,
        createdAt: new Date().toISOString(),
      };
      updatedTxs = [newTx, ...updatedTxs];
    }

    setWallet(updatedWallet);
    setTransactions(updatedTxs);
    setReports(updatedReports);
    try {
      localStorage.setItem("mobi_wallet_v4", JSON.stringify(updatedWallet));
      localStorage.setItem("mobi_txs_v4", JSON.stringify(updatedTxs));
      localStorage.setItem("mobi_reports_v4", JSON.stringify(updatedReports));
    } catch {}
  };

  const registerForEvent = (eventId: string, coinsToApply: number) => {
    const evt = events.find((e) => e.id === eventId);
    if (!evt) return { success: false, message: "Event not found" };

    const maxAllowed = Math.min(coinsToApply, evt.maxCoinDiscount, wallet.mobiCoins, evt.fee);
    if (wallet.mobiCoins < maxAllowed) {
      return { success: false, message: "Insufficient Mobi Coins" };
    }

    const discountAmount = maxAllowed;
    const finalPaid = Math.max(0, evt.fee - discountAmount);

    const newReg: EventRegistration = {
      id: `reg-${Date.now()}`,
      eventId: evt.id,
      eventTitle: evt.title,
      userId: profile.id,
      userName: profile.fullName || "Student",
      originalFee: evt.fee,
      coinsUsed: maxAllowed,
      discountAmount,
      finalPaid,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    let updatedWallet = { ...wallet };
    let updatedTxs = [...transactions];

    if (maxAllowed > 0) {
      updatedWallet = {
        ...updatedWallet,
        mobiCoins: updatedWallet.mobiCoins - maxAllowed,
        updatedAt: new Date().toISOString(),
      };
      const newTx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        userId: profile.id,
        currency: "mobi_coin",
        amount: maxAllowed,
        action: "spent",
        description: `Discount on ${evt.title}`,
        referenceId: newReg.id,
        createdAt: new Date().toISOString(),
      };
      updatedTxs = [newTx, ...updatedTxs];
    }

    const updatedEvents = events.map((e) =>
      e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e
    );

    setEvents(updatedEvents);
    setWallet(updatedWallet);
    setTransactions(updatedTxs);
    setRegistrations([newReg, ...registrations]);

    try {
      localStorage.setItem("mobi_wallet_v4", JSON.stringify(updatedWallet));
      localStorage.setItem("mobi_txs_v4", JSON.stringify(updatedTxs));
    } catch {}

    return { success: true, registration: newReg };
  };

  const awardCivicQuizPoints = () => {
    const award = 3;
    const updatedWallet = {
      ...wallet,
      chatPoints: wallet.chatPoints + award,
      updatedAt: new Date().toISOString(),
    };
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      userId: profile.id,
      currency: "chat_point",
      amount: award,
      action: "earned",
      description: "Civic Quiz Completed",
      createdAt: new Date().toISOString(),
    };
    setWallet(updatedWallet);
    setTransactions([newTx, ...transactions]);
    try {
      localStorage.setItem("mobi_wallet_v4", JSON.stringify(updatedWallet));
      localStorage.setItem("mobi_txs_v4", JSON.stringify([newTx, ...transactions]));
    } catch {}
    return award;
  };

  const spendChatPoint = (): boolean => {
    if (wallet.chatPoints < 1) return false;
    const updatedWallet = {
      ...wallet,
      chatPoints: wallet.chatPoints - 1,
      updatedAt: new Date().toISOString(),
    };
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      userId: profile.id,
      currency: "chat_point",
      amount: 1,
      action: "spent",
      description: "Student Chat Session",
      createdAt: new Date().toISOString(),
    };
    setWallet(updatedWallet);
    setTransactions([newTx, ...transactions]);
    try {
      localStorage.setItem("mobi_wallet_v4", JSON.stringify(updatedWallet));
      localStorage.setItem("mobi_txs_v4", JSON.stringify([newTx, ...transactions]));
    } catch {}
    return true;
  };

  const addAnnouncement = (title: string, content: string, category: Announcement["category"], dept?: string) => {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      category,
      department: dept,
      author: profile.fullName || "Admin Office",
      pinned: false,
      createdAt: new Date().toISOString(),
    };
    setAnnouncements([newAnn, ...announcements]);
    return newAnn;
  };

  const toggleRole = () => {
    const nextIsAdmin = !isAdminView;
    setIsAdminView(nextIsAdmin);
    setProfile((prev) => ({
      ...prev,
      role: nextIsAdmin ? "admin" : "student",
      fullName: nextIsAdmin ? "Campus Admin" : (prev.fullName || "Student"),
      department: nextIsAdmin ? "Administration" : (prev.department || "Computer Science"),
    }));
  };

  return {
    profile,
    wallet,
    transactions,
    reports,
    bins,
    events,
    registrations,
    announcements,
    isAdminView,
    isLoaded,
    saveProfile,
    submitWasteReport,
    reviewReport,
    registerForEvent,
    awardCivicQuizPoints,
    spendChatPoint,
    addAnnouncement,
    toggleRole,
    setProfile,
  };
}
