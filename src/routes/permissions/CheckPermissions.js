// checkPermissions.js
import { rolesPermissions, defaultConfig } from "./PermissionsConfig";

export const hasPermission = (userData, route) => {
  if (!userData) {
    // If userData is not defined, return false
    return false;
  }

  const { department_title, designation_title } = userData;

  console.log(userData);

  // Check if department exists in rolesPermissions
  if (rolesPermissions[department_title]) {
    // Get permissions for the designation within the department
    const departmentPermissions = rolesPermissions[department_title];
    const designationPermissions =
      departmentPermissions[designation_title] || [];

    // Check if the route is allowed for the user's designation
    if (
      designationPermissions.some((permission) => permission.path === route)
    ) {
      return true;
    }
  }

  // Check if the route is part of default permissions
  return defaultConfig.some((permission) => permission.path === route);
};
