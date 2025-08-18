export const checkUserRole = (user, roles = []) => {
  const userRoles = user?.claims?.roles || [];
  return roles.some(role => userRoles.includes(role));
};
