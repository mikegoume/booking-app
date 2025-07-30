import React, { createContext, useContext, useState } from "react";

export type Role = "trainee" | "trainer";

export interface User {
  id: string; // Primary key
  name: string;
  email: string;
  role: Role; // Enum: 'trainee' or 'trainer'
  remaining_visits: number; // For trainees only (trainers usually 0)
}

// ==========================
// 2. Slot Type
// ==========================
export interface TimeSlot {
  id: number; // Auto-increment primary key
  user_id: string; // Foreign key -> User (trainer)
  title: string;
  date: string; // ISO date string (YYYY-MM-DD)
  start_time: string; // HH:mm (24hr)
  end_time: string; // HH:mm (24hr)
  description?: string;
  max_capacity: number;
  current_bookings: number; // Derived or tracked field
}

// ==========================
// 3. Slot Booking Type
// ==========================
export type BookingStatus = "confirmed" | "cancelled";

export interface Booking {
  id: number; // Auto-increment primary key
  slot_id: number; // Foreign key -> Slot
  user_id: string; // Foreign key -> User (trainee)
  booking_status: BookingStatus;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  chatMessages: ChatMessage[];
  createTimeSlot: (
    slot: Omit<TimeSlot, "id" | "currentBookings" | "bookedByIds">,
  ) => void;
  bookSlot: (slotId: number) => boolean;
  cancelBooking: (bookingId: string) => void;
  login: (username: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  getAllUsers: () => User[];
  updateUserVisits: (userId: string, visits: number) => void;
  getChatMessages: (userId1: string, userId2: string) => any[];
  sendMessage: (senderId: string, receiverId: string, text: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock user database
const mockUsers: Record<string, User> = {
  john: {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "trainee",
    remainingVisits: 5,
  },
  sarah: {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "trainer",
    remainingVisits: 0,
  },
  mike: {
    id: "3",
    name: "Mike Wilson",
    email: "mike@example.com",
    role: "trainer",
    remainingVisits: 0,
  },
  emma: {
    id: "4",
    name: "Emma Davis",
    email: "emma@example.com",
    role: "trainee",
    remainingVisits: 8,
  },
  alex: {
    id: "5",
    name: "Alex Thompson",
    email: "alex@example.com",
    role: "trainee",
    remainingVisits: 3,
  },
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<Record<string, User>>(mockUsers);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      senderId: "2",
      senderName: "Sarah Johnson",
      receiverId: "4",
      text: "Hi Emma! Looking forward to our training session tomorrow.",
      timestamp: "2024-12-26T15:30:00Z",
    },
    {
      id: "2",
      senderId: "4",
      senderName: "Emma Davis",
      receiverId: "2",
      text: "Hi Sarah! Me too! Should I bring anything specific?",
      timestamp: "2024-12-26T15:35:00Z",
    },
    {
      id: "3",
      senderId: "2",
      senderName: "Sarah Johnson",
      receiverId: "4",
      text: "Just bring a water bottle and a towel. We'll focus on upper body strength training.",
      timestamp: "2024-12-26T15:40:00Z",
    },
  ]);

  const login = (username: string): boolean => {
    const foundUser = users[username.toLowerCase()];
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const getAllUsers = (): User[] => {
    return Object.values(users);
  };

  const updateUserVisits = (userId: string, visits: number) => {
    setUsers((prev) => ({
      ...prev,
      [Object.keys(prev).find((key) => prev[key].id === userId) || ""]: {
        ...prev[Object.keys(prev).find((key) => prev[key].id === userId) || ""],
        remainingVisits: visits,
      },
    }));

    // Update current user if it's the same user
    if (user && user.id === userId) {
      setUser((prev) => (prev ? { ...prev, remainingVisits: visits } : null));
    }
  };

  const createTimeSlot = (
    slotData: Omit<TimeSlot, "id" | "currentBookings" | "bookedByIds">,
  ) => {
    const newSlot: TimeSlot = {
      ...slotData,
      id: Date.now().toString(),
      currentBookings: 0,
      bookedByIds: [],
    };
    setTimeSlots((prev) => [...prev, newSlot]);
  };

  const bookSlot = (slotId: number): boolean => {
    if (!user || user.remainingVisits <= 0) return false;

    const slot = timeSlots.find((s) => s.id === slotId);
    if (!slot || slot.currentBookings >= slot.maxCapacity) return false;

    if (slot.bookedByIds.includes(user.id)) return false;

    // Update slot
    setTimeSlots((prev) =>
      prev.map((s) =>
        s.id === slotId
          ? {
              ...s,
              currentBookings: s.currentBookings + 1,
              bookedByIds: [...s.bookedByIds, user.id],
            }
          : s,
      ),
    );

    // Create booking
    const newBooking: Booking = {
      id: Date.now().toString(),
      userId: user.id,
      slotId,
      slot,
      bookedAt: new Date().toISOString(),
      status: "active",
    };
    setBookings((prev) => [...prev, newBooking]);

    // Decrease user's remaining visits
    setUser((prev) =>
      prev ? { ...prev, remainingVisits: prev.remainingVisits - 1 } : null,
    );
    updateUserVisits(user.id, user.remainingVisits - 1);

    return true;
  };

  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking || booking.status === "cancelled") return;

    // Update booking status
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b)),
    );

    // Update slot
    setTimeSlots((prev) =>
      prev.map((s) =>
        s.id === booking.slotId
          ? {
              ...s,
              currentBookings: s.currentBookings - 1,
              bookedByIds: s.bookedByIds.filter((id) => id !== booking.userId),
            }
          : s,
      ),
    );

    // Refund user's visit
    if (user && booking.userId === user.id) {
      const newVisits = user.remainingVisits + 1;
      setUser((prev) =>
        prev ? { ...prev, remainingVisits: newVisits } : null,
      );
      updateUserVisits(user.id, newVisits);
    }
  };

  const getChatMessages = (userId1: string, userId2: string) => {
    const messages = chatMessages.filter(
      (msg) =>
        (msg.senderId === userId1 && msg.receiverId === userId2) ||
        (msg.senderId === userId2 && msg.receiverId === userId1),
    );

    return messages
      .map((msg) => ({
        ...msg,
        isCurrentUser: msg.senderId === userId1,
      }))
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
  };

  const sendMessage = (
    senderId: string,
    receiverId: string,
    text: string,
  ): boolean => {
    const sender = getAllUsers().find((u) => u.id === senderId);
    if (!sender) return false;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId,
      senderName: sender.name,
      receiverId,
      text,
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, newMessage]);
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        chatMessages,
        createTimeSlot,
        bookSlot,
        cancelBooking,
        login,
        logout,
        isAuthenticated,
        getAllUsers,
        updateUserVisits,
        getChatMessages,
        sendMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
