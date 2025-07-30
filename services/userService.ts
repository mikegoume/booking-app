import { User } from "@/contexts/AppContext";
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

export const fetchUsers = async (): Promise<User[]> => {
  let { data: users, error } = await supabase.from("users").select("*");

  if (error) {
    throw error;
  } else {
    return users as User[];
  }
};

export const fetchUserById = async (id: string): Promise<User> => {
  let { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  } else {
    return user as User;
  }
};
