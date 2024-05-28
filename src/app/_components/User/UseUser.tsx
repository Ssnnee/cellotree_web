import { useEffect, useState } from "react";
import { useUser } from "~/actions/auth.actions";

interface User {
  id: string;
  username: string;
}

interface UseUserResult {
  user: User | null;
  isSignedIn: boolean;
  loading: boolean;
}

export const useUserHook = (): UseUserResult => {
  const [user, setUser] = useState<any | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await useUser();
        if (userData) {
          setUser(userData);
          setIsSignedIn(true);
        } else {
          setIsSignedIn(false);
        }
      } catch (error) {
        console.error("Error fetching user data", error);
        setIsSignedIn(false);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  return { user, isSignedIn, loading };
};
