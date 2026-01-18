import api from "../utils/api";

// GET CURRENT USER PROFILE
export const getCurrentUser = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

// UPDATE CURRENT USER PROFILE
export const updateUserProfile = async (data) => {
  const res = await api.put("/users/me", data);
  return res.data;
};

