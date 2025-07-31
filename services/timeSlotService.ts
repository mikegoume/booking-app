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

export const fetchTimeSlots = async () => {
  let { data: slots, error } = await supabase.from("slots").select("*");

  if (error) {
    throw error;
  } else {
    return slots;
  }
};

export const fetchTimeSlotById = async (id: number) => {
  let { data: slot, error } = await supabase
    .from("slots")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  } else {
    return slot;
  }
};

export const fetchTimeSlotByUserId = async (userId: string) => {
  console.log(userId);
  let { data: slots, error } = await supabase
    .from("slots")
    .select("*")
    .eq("user_id", userId);

  console.log("response: ", slots);

  if (error) {
    throw error;
  } else {
    return slots;
  }
};
