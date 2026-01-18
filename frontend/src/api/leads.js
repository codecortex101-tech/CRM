import api from "../utils/api";

/* =========================
   GET ALL LEADS
========================= */
export const fetchLeads = async () => {
  const res = await api.get("/leads");
  return res.data;
};

/* =========================
   GET SINGLE LEAD
========================= */
export const fetchLeadById = async (id) => {
  const res = await api.get(`/leads/${id}`);
  return res.data;
};

/* =====================
   CREATE LEAD
===================== */
export const createLead = async (data) => {
  const res = await api.post("/leads", data);
  return res.data;
};

/* =====================
   UPDATE LEAD
===================== */
export const updateLead = async (id, data) => {
  const res = await api.put(`/leads/${id}`, data);
  return res.data;
};

/* =====================
   DELETE LEAD
===================== */
export const deleteLead = async (id) => {
  const res = await api.delete(`/leads/${id}`);
  return res.data;
};
