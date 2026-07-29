import { supabase } from "@/src/config/supabase";
import type { Session } from "@supabase/supabase-js";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

type Profile = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  created_at: string;
};

// ---- useAuth: session state + sign out ----

type AuthContextValue = {
  session: Session | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoaded(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ session, isLoaded, isSignedIn: !!session, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

// ---- useUser: Clerk-shaped compat layer over the session + public.users row ----
// Keeps existing screens (user?.firstName, user?.emailAddresses[0]?.emailAddress,
// user?.imageUrl, user?.createdAt) working with only an import swap.

type CompatUser = {
  id: string;
  firstName: string | null;
  fullName: string | null;
  imageUrl: string | null;
  emailAddresses: { emailAddress: string }[];
  createdAt: Date | null;
};

export function useUser(): { user: CompatUser | null; isLoaded: boolean } {
  const { session, isLoaded: authLoaded } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!session?.user) {
      setProfile(null);
      setProfileLoaded(true);
      return;
    }

    setProfileLoaded(false);
    supabase
      .from("users")
      .select("id, name, email, avatar, created_at")
      .eq("id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) {
          setProfile(data ?? null);
          setProfileLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  if (!authLoaded || !profileLoaded) {
    return { user: null, isLoaded: false };
  }

  if (!session?.user) {
    return { user: null, isLoaded: true };
  }

  const user: CompatUser = {
    id: session.user.id,
    firstName: profile?.name?.split(" ")[0] ?? null,
    fullName: profile?.name ?? null,
    imageUrl: profile?.avatar ?? null,
    emailAddresses: [
      { emailAddress: profile?.email ?? session.user.email ?? "" },
    ],
    createdAt: session.user.created_at
      ? new Date(session.user.created_at)
      : null,
  };

  return { user, isLoaded: true };
}

// ---- useSignUp / useSignIn: email + password with email-code confirmation ----

export function useSignUp() {
  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });
    return { error: error?.message ?? null };
  }, []);

  const verifyEmailCode = useCallback(
    async (email: string, code: string, name: string) => {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code.trim(),
        type: "signup",
      });
      if (error) return { error: error.message };

      const userId = data.user?.id;
      if (userId) {
        // Create the matching public.users profile row required by the schema.
        const { error: profileError } = await supabase.from("users").insert({
          id: userId,
          name,
          email: email.trim().toLowerCase(),
        });
        if (profileError) return { error: profileError.message };
      }

      return { error: null };
    },
    [],
  );

  const resendCode = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim().toLowerCase(),
    });
    return { error: error?.message ?? null };
  }, []);

  return { signUp, verifyEmailCode, resendCode };
}

export function useSignIn() {
  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    return { error: error?.message ?? null };
  }, []);

  return { signIn };
}
