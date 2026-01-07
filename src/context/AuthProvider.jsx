import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase.config";
import { AuthContext } from "./AuthContext";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch user role
  const { data: role, isLoading: isRoleLoading } = useQuery({
    queryKey: ["role", user?.email],
    enabled: !!user,
    queryFn: async () => {
      const res = await axiosSecure.get("/me");
      return res.data.role; // Assuming backend returns { role: "..." }
    },
  });

  const authInfo = { user, loading, register, login, logout, role, isRoleLoading };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
