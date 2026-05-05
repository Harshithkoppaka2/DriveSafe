import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './state/AuthContext'
import AppShell from './components/AppShell'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import VehiclesPage from './pages/VehiclesPage'
import RentalsPage from './pages/RentalsPage'
import MaintenancePage from './pages/MaintenancePage'
import InspectionsPage from './pages/InspectionsPage'
import EmployeesPage from './pages/EmployeesPage'

function Protected({ children }) {
  const { session } = useAuth()
  return session ? children : <Navigate to="/login" replace />
}

function AdminOnly({ children }) {
  const { session } = useAuth()
  return session?.role === 'ADMIN' ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Protected><AppShell /></Protected>}>
        <Route index element={<DashboardPage />} />
        <Route path="vehicles" element={<VehiclesPage />} />
        <Route path="rentals" element={<RentalsPage />} />
        <Route path="maintenance" element={<MaintenancePage />} />
        <Route path="inspections" element={<InspectionsPage />} />
        <Route path="employees" element={<AdminOnly><EmployeesPage /></AdminOnly>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
