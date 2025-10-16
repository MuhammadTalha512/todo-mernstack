import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const initialState = { isAuth: false, user: null };

const AuthContextProvider = ({ children }) => {
  const [state, setContextState] = useState(initialState);
  const [isAppLoading, setIsAppLoading] = useState(true);

  const UserProfile = useCallback(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setContextState({
        isAuth: true,
        user: JSON.parse(storedUser),
      });
    } else {
      setContextState(initialState);
    }
  }, []);
  
  useEffect(() => {
    UserProfile();
    setIsAppLoading(false);
  }, [UserProfile]);
  
  const handleLogin = async (data) => {
    try {
      if (data?.token && data?.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setContextState({ isAuth: true, user: data.user });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleRegister = async (data) => {
    try {
      if (data?.token && data?.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setContextState({ isAuth: true, user: data.user });
      }
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setContextState(initialState);
  }, []);

  return (
    <AuthContext.Provider
      value={{Authstate: state,setContextState,isAppLoading,handleLogin,handleRegister,handleLogout,}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthContextProvider;
