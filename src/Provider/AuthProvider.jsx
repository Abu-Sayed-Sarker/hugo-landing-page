import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from "firebase/auth";
import { createContext, useState } from "react";
import { auth } from "../firebase/firebase.config";
export const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const provider = new GoogleAuthProvider();
  const appleProvider = new OAuthProvider('apple.com');

  const handleGoogleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  };

  const handleAppleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, appleProvider);
  };

  const authInfo = {
    loading,
    handleGoogleLogin,
    handleAppleLogin,
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
