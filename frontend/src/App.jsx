import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import AddLead from "./pages/AddLead";
import AssignLead from "./pages/AssignLead";
import LeadDetails from "./pages/LeadDetails";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/login"
          element={
            isAuthenticated() ? <Navigate to="/" /> : <Login />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated() ? <Navigate to="/" /> : <Register />
          }
        />
        <Route
          path="/leads"
          element={
            isAuthenticated() ? <Leads /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/add-lead"
          element={
            isAuthenticated() ? <AddLead /> : <Navigate to="/login" />
          }
        />

        {/* 🔥 THIS ROUTE MUST BE INSIDE <Routes> */}
        <Route
          path="/assign-lead/:id"
          element={
            isAuthenticated() ? <AssignLead /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/leads/:id"
          element={isAuthenticated() ? <LeadDetails /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
