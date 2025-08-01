import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const fetchBookingsOfUser = async (userId: string) => {
  const { data, error } = await supabase
    .from("slot_bookings")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw error;
  } else {
    return data;
  }
};

export const fetchBookingsOfUserForSlot = async (
  slotId: number,
  userId: string,
) => {
  const { data, error } = await supabase
    .from("slot_bookings")
    .select("*")
    .eq("slot_id", slotId)
    .eq("user_id", userId);

  if (error) {
    throw error;
  } else {
    return data;
  }
};

export const bookSlot = async (slotId: number, userId: string) => {
  const { data, error } = await supabase
    .from("slot_bookings")
    .insert([{ slot_id: slotId, booking_status: "confirmed", user_id: userId }])
    .select();

  console.log(data, error);

  if (error) {
    throw error;
  } else {
    return data;
  }
};
