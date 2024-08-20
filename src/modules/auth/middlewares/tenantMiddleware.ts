import { Request, Response, NextFunction } from 'express';

const setTenantSchema = (req: Request, res: Response, next: NextFunction) => {
  const tenant = req.header('X-Tenant-ID');
  if (!tenant) {
    return res.status(400).send('Tenant ID is required');
  }
  res.locals.tenant = tenant;
  next();
};

export default setTenantSchema;
