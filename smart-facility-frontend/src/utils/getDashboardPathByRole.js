import { ROLES } from './constants';

export function getDashboardPathByRole(role) {
  switch (role) {
    case ROLES.USER:
      return '/user/dashboard';
    case ROLES.COORDINATOR:
      return '/coordinator/dashboard';
    case ROLES.TECHNICIAN:
      return '/technician/dashboard';
    case ROLES.ADMIN:
      return '/admin/dashboard';
    default:
      return '/login';
  }
}
