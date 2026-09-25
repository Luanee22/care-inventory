import { Route, Routes } from "react-router-dom";
import { CaregiverHome } from "./pages/CaregiverHome";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminLayout } from "./components/AdminLayout";
import { Dashboard } from "./pages/admin/Dashboard";
import { Inbound } from "./pages/admin/Inbound";
import { History } from "./pages/admin/History";
import { Settings } from "./pages/admin/Settings";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CaregiverHome />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="inbound" element={<Inbound />} />
        <Route path="history" element={<History />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
