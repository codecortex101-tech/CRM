import axios from "axios";

export const fetchLeads = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get("http://localhost:5000/api/leads", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
