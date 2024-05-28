"use client";


import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useUser as getUser } from "~/actions/auth.actions";

// interface User {
//   username: string;
//   id: string;
// }
//
// interface AuthContextProps {
//   isSignedIn: boolean;
//   user: User | null;
//   signIn: (user: User) => void;
//   signOut: () => void;
// }
//
// const AuthContext = createContext<AuthContextProps | undefined>(undefined);
//
// export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
//   const [isSignedIn, setIsSignedIn] = useState(false);
//   const [user, setUser] = useState<User | null>(null);
//
//   const signIn = (user: User) => {
//     setIsSignedIn(true);
//     setUser(user);
//   };
//
//   const signOut = () => {
//     setIsSignedIn(false);
//     setUser(null);
//   };
//
//   return (
//     <AuthContext.Provider value={{ isSignedIn, user, signIn, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
//
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
//

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser()  ;
      if (user) {
        setUser(user);
        setIsSignedIn(true);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isSignedIn, setUser, setIsSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUser must be used within an AuthProvider");
  }
  return context;
};
