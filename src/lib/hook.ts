import { useEffect, useState } from "react";
import { getUser } from "~/actions/auth.actions";

interface User {
  id: string;
  username: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser()  ;
      if (user) {
        setUser(user);
      }
    };
    fetchUser();
  }, [user]);


  return [user, setUser];
}
