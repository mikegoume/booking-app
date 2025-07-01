import React, { createContext, useContext, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "trainer" | "trainee";
  remainingVisits: number;
}

export interface TimeSlot {
  id: string;
  trainerId: string;
  trainerName: string;
  date: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  currentBookings: number;
  bookedByIds: string[];
  description?: string;
}

export interface Booking {
  id: string;
  userId: string;
  slotId: string;
  slot: TimeSlot;
  bookedAt: string;
  status: "active" | "cancelled";
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  timeSlots: TimeSlot[];
  setTimeSlots: React.Dispatch<React.SetStateAction<TimeSlot[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  createTimeSlot: (
    slot: Omit<TimeSlot, "id" | "currentBookings" | "bookedByIds">,
  ) => void;
  bookSlot: (slotId: string) => boolean;
  cancelBooking: (bookingId: string) => void;
  login: (username: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
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

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: "1",
      trainerId: "2",
      trainerName: "Sarah Johnson",
      date: "2025-07-02",
      startTime: "09:00",
      endTime: "10:00",
      maxCapacity: 4,
      currentBookings: 3,
      bookedByIds: ["4", "5", "6"],
      description: "High-intensity interval training session",
    },
    {
      id: "2",
      trainerId: "2",
      trainerName: "Sarah Johnson",
      date: "2025-07-02",
      startTime: "11:00",
      endTime: "12:00",
      maxCapacity: 3,
      currentBookings: 2,
      bookedByIds: ["4", "7"],
      description: "Strength training focused on upper body",
    },
    {
      id: "3",
      trainerId: "3",
      trainerName: "Mike Wilson",
      date: "2025-07-03",
      startTime: "08:00",
      endTime: "09:00",
      maxCapacity: 5,
      currentBookings: 2,
      bookedByIds: ["1", "5"],
      description: "Morning cardio and flexibility training",
    },
    {
      id: "4",
      trainerId: "3",
      trainerName: "Mike Wilson",
      date: "2025-07-04",
      startTime: "10:00",
      endTime: "11:00",
      maxCapacity: 4,
      currentBookings: 0,
      bookedByIds: [],
      description: "Core strengthening and balance training",
    },
    {
      id: "5",
      trainerId: "4",
      trainerName: "Emily Chen",
      date: "2025-07-05",
      startTime: "07:00",
      endTime: "08:00",
      maxCapacity: 6,
      currentBookings: 4,
      bookedByIds: ["2", "3", "5", "8"],
      description: "Sunrise yoga and meditation",
    },
    {
      id: "6",
      trainerId: "4",
      trainerName: "Emily Chen",
      date: "2025-07-06",
      startTime: "17:00",
      endTime: "18:00",
      maxCapacity: 5,
      currentBookings: 1,
      bookedByIds: ["6"],
      description: "Evening stretch and mobility class",
    },
  ]);

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "1",
      userId: "1",
      slotId: "3",
      slot: timeSlots[2],
      bookedAt: "2025-06-30T10:30:00Z",
      status: "active",
    },
    {
      id: "2",
      userId: "4",
      slotId: "1",
      slot: timeSlots[0],
      bookedAt: "2025-06-30T14:15:00Z",
      status: "active",
    },
    {
      id: "3",
      userId: "5",
      slotId: "1",
      slot: timeSlots[0],
      bookedAt: "2025-06-30T14:30:00Z",
      status: "active",
    },
    {
      id: "4",
      userId: "2",
      slotId: "5",
      slot: timeSlots[4],
      bookedAt: "2025-07-01T07:00:00Z",
      status: "active",
    },
    {
      id: "5",
      userId: "6",
      slotId: "6",
      slot: timeSlots[5],
      bookedAt: "2025-07-01T08:00:00Z",
      status: "active",
    },
    {
      id: "6",
      userId: "7",
      slotId: "2",
      slot: timeSlots[1],
      bookedAt: "2025-07-01T08:30:00Z",
      status: "active",
    },
  ]);

  const login = (username: string): boolean => {
    const foundUser = mockUsers[username.toLowerCase()];
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

  const bookSlot = (slotId: string): boolean => {
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
      setUser((prev) =>
        prev ? { ...prev, remainingVisits: prev.remainingVisits + 1 } : null,
      );
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        timeSlots,
        setTimeSlots,
        bookings,
        setBookings,
        createTimeSlot,
        bookSlot,
        cancelBooking,
        login,
        logout,
        isAuthenticated,
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
