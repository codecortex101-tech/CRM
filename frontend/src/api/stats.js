import api from "../utils/api";

export const fetchStats = async () => {
  const res = await api.get("/leads");
  const leads = res.data;

  return {
    total: leads.length,
    new: leads.filter(l => l.status === "New").length,
    contacted: leads.filter(l => l.status === "Contacted").length,
    qualified: leads.filter(l => l.status === "Qualified").length,
    closed: leads.filter(l => l.status === "Closed").length,
    high: leads.filter(l => l.priority === "High").length,
  };
};
