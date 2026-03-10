export const getRoleHomePath = (role) => {
  switch (role) {
    case 'ADMIN':
      return '/admin/moderation';
    case 'BUYER':
      return '/dashboard/buyer';
    case 'FARMER':
      return '/dashboard/farmer';
    default:
      return '/login';
  }
};