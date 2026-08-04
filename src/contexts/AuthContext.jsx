import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, role, avatar_url, is_active")
      .eq("id", userId)
      .single();
    if (error) {
      console.error("Failed to load profile:", error.message);
      setProfile(null);
      return;
    }
    setProfile(data);
  }, []);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;
      setSession(session);
      await loadProfile(session?.user?.id);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      await loadProfile(session?.user?.id);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    role: profile?.role ?? null,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
