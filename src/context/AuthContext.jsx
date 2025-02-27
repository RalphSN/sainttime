import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext"; // 使用獨立的 AuthContext.js

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 檢查 localStorage 是否有已登入的使用者
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 登入，更新 Context
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData); // 確保立即更新 `user`
  };

  // 登出，清除 Context
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
