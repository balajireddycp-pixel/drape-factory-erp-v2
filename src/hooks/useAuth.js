import { useAuthContext } from "@/contexts/AuthContext";

/**
 * Public hook for consuming auth state anywhere in the app.
 * Keeps components decoupled from the context implementation.
 */
export function useAuth() {
  return useAuthContext();
}
