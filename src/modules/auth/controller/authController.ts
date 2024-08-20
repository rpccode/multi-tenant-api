import { Request, Response } from 'express';
import { ErrorDB } from '../../../interface/ErrorDB';
import { createAdminSchema, createTenantAndUser, ValidateTenant } from '../services/schemaService';
import { AppDataSource } from '../../../config/data-source';
import { Role, User } from '../interfaces';
import AuthService from '../services/AuthServices';


export const singIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const tenant = res.locals.tenant;

  try {
 
   const token = await AuthService.singIn(username, password, tenant)

    
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).send('Error logging in'+ error);
  }
};

export const assignRoleToUser = async (req: Request, res: Response) => {
  const { userId, roleName } = req.body;
  const userRepository = AppDataSource.getRepository(User);
  const roleRepository = AppDataSource.getRepository(Role);

  try {
    const user = await userRepository.findOneBy({ id: userId });
    const role = await roleRepository.findOneBy({ name: roleName });

    if (!user || !role) {
      return res.status(404).json({ message: 'User or Role not found' });
    }

    user.roles.push(role);
    await userRepository.save(user);

    res.status(200).json({ message: 'Role assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
};
export const createUserAndTenant = async (req: Request, res: Response) => {
  const { username,email, password, role, planId } = req.body;
  const tenant = res.locals.tenant;

  try {
    await createTenantAndUser(tenant, username, email, password, role, planId);
  
    res.status(201).send({
      ok: true,
      message: 'User and tenant created successfully',
    });
  } catch (error) {
    const errorMessage : ErrorDB = error
    res.status(500).send({
      ok:false,
      message: 'Error creating user and tenant',
     errorMessage:{
      query:       errorMessage.query ,
      parameters:  errorMessage.parameters,
      length:       errorMessage.length,
      severity:     errorMessage.severity,
      code:         errorMessage.code,
      detail:       errorMessage.detail,
      schema:       errorMessage.schema,
      table:        errorMessage.table,
      column:       errorMessage.column,
      file:         errorMessage.file,
      line:         errorMessage.line,
      routine:      errorMessage.routine,
      name:        errorMessage.name,
      
     },
    });
  }
};

export const validateTenant = async (req: Request, res: Response) =>{

  const tenant = req.params.tenant;
  // console.log(req.params)
try {
  
  const tenantValidation = await ValidateTenant(tenant);
  
  if (tenantValidation) {
    res.status(200).send({
      ok: true,
      message: 'Tenant found',
      tenant: tenant,
    });
  } else {
    res.status(404).send({
      ok: false,
      message: 'Tenant not found',
      tenant: tenant,
    });
  }
  
} catch (error) {

  res.status(500).send({
    ok: false,
    message: 'Error validating tenant',
    error: error.message,
  });
}


}

export const createAdminTable = async (req: Request , res: Response ) => {
    try {
    
      
      await createAdminSchema()
      res.status(200).send({
        ok: true,
        message: 'Admin table created successfully',
      });
      
    } catch (error) {

      res.status(500).send({
        ok: false,
        message: 'Error creating admin table',
        error: error.message,
      });
    }
}