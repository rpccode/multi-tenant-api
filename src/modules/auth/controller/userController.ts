import { Request, Response } from 'express';

import { assignPermissionToRole, createUser, deleteRole, deleteUser, getUsers, updateUser, updateUserRole } from '../services/UserServices';

export const registerUser = async (req: Request, res: Response) => {
  const { username,email, password, tenant,role } = req.body;
  const tenantuser = res.locals.tenant || tenant;

  try {
    await createUser(tenantuser, username,email, password,role);
    res.status(201).send({
      ok: true,
      message: 'User created successfully'
    });
  } catch (error) {
    res.status(500).send({
      ok: false,
      message: 'Error creating user',
      error
      
    });
  }
};
export const changeUserRole = async (req: Request, res: Response) => {
  const { username, newRole } = req.body;
  const tenant = res.locals.tenant;

  try {
    await updateUserRole(tenant, username, newRole);
    res.status(200).send('User role updated successfully');
  } catch (error) {
    res.status(500).send('Error updating user role');
  }
};

export const removeUser = async (req: Request, res: Response) => {
  const { username } = req.body;
  const tenant = res.locals.tenant;

  try {
    await deleteUser(tenant, username);
    res.status(200).send('User deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting user');
  }
};

export const removeRole = async (req: Request, res: Response) => {
  const { roleName } = req.body;
  const tenant = res.locals.tenant;

  try {
    await deleteRole(tenant, roleName);
    res.status(200).send('Role deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting role');
  }
};

export const listUsers = async (req: Request, res: Response) => {
  const tenant = res.locals.tenant;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string || '';

  try {
    const result = await getUsers(tenant, page, limit, search);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send('Error fetching users');
  }
};

export const updateUserData = async (req: Request, res: Response) => {
  const { username, newUsername, newPassword } = req.body;
  const tenant = res.locals.tenant;

  try {
    await updateUser(tenant, username, newUsername, newPassword);
    res.status(200).send('User updated successfully');
  } catch (error) {
    res.status(500).send('Error updating user');
  }
};

export const assignPermission = async (req: Request, res: Response) => {
  const { roleId, permissionName } = req.body;
  const tenant = res.locals.tenant;

  try {
    await assignPermissionToRole(tenant, roleId, permissionName);
    res.status(200).send('Permission assigned to role successfully');
  } catch (error) {
    res.status(500).send({
      ok: false,
      message: 'Error assigning permission to role',
      error,
    });
  }
};

