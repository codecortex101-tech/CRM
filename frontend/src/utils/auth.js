export const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch (error) {
    console.error("Invalid token");
    return null;
  }
};

// ✅ ADD THIS (NO SIDE EFFECT)
export const getUserName = () => {
  // First check localStorage for saved name
  const savedName = localStorage.getItem("userName");
  if (savedName) {
    return savedName;
  }

  // Fallback: try to get from token (if available)
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.name || payload.email || "User";
  } catch (error) {
    console.error("Invalid token");
    return "User";
  }
};
