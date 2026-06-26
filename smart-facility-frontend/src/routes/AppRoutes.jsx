import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from '../pages/auth/LoginPage';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import RoleProtectedRoute from '../components/layout/RoleProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProfilePage from '../pages/ProfilePage';

import UserDashboard from '../pages/user/UserDashboard';
import CreateTicketPage from '../pages/user/CreateTicketPage';
import MyTicketsPage from '../pages/user/MyTicketsPage';
import UserTicketDetailsPage from '../pages/user/UserTicketDetailsPage';

import CoordinatorDashboard from '../pages/coordinator/CoordinatorDashboard';
import ManageTicketsPage from '../pages/coordinator/ManageTicketsPage';
import CoordinatorTicketDetailsPage from '../pages/coordinator/CoordinatorTicketDetailsPage';

import TechnicianDashboard from '../pages/technician/TechnicianDashboard';
import AssignedTicketsPage from '../pages/technician/AssignedTicketsPage';
import TechnicianTicketDetailsPage from '../pages/technician/TechnicianTicketDetailsPage';

import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsersPage from '../pages/admin/ManageUsersPage';
import ManageCategoriesPage from '../pages/admin/ManageCategoriesPage';
import AllTicketsPage from '../pages/admin/AllTicketsPage';
import AdminTicketDetailsPage from '../pages/admin/AdminTicketDetailsPage';

import { useAuth } from '../hooks/useAuth';
import { getDashboardPathByRole } from '../utils/getDashboardPathByRole';
import { ROLES } from '../utils/constants';

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/profile" element={<ProfilePage />} />

          <Route element={<RoleProtectedRoute allowedRoles={[ROLES.USER]} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/tickets/new" element={<CreateTicketPage />} />
            <Route path="/user/tickets" element={<MyTicketsPage />} />
            <Route path="/user/tickets/:id" element={<UserTicketDetailsPage />} />
          </Route>

          <Route element={<RoleProtectedRoute allowedRoles={[ROLES.COORDINATOR]} />}>
            <Route path="/coordinator/dashboard" element={<CoordinatorDashboard />} />
            <Route path="/coordinator/tickets" element={<ManageTicketsPage />} />
            <Route path="/coordinator/tickets/:id" element={<CoordinatorTicketDetailsPage />} />
          </Route>

          <Route element={<RoleProtectedRoute allowedRoles={[ROLES.TECHNICIAN]} />}>
            <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
            <Route path="/technician/tickets" element={<AssignedTicketsPage />} />
            <Route path="/technician/tickets/:id" element={<TechnicianTicketDetailsPage />} />
          </Route>

          <Route element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsersPage />} />
            <Route path="/admin/categories" element={<ManageCategoriesPage />} />
            <Route path="/admin/tickets" element={<AllTicketsPage />} />
            <Route path="/admin/tickets/:id" element={<AdminTicketDetailsPage />} />
          </Route>
        </Route>
      </Route>

      <Route
        path="/"
        element={<Navigate to={user ? getDashboardPathByRole(user.role) : '/login'} replace />}
      />
      <Route
        path="*"
        element={<Navigate to={user ? getDashboardPathByRole(user.role) : '/login'} replace />}
      />
    </Routes>
  );
}
