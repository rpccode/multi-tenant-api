import { Request, Response, NextFunction } from 'express';
import setTenantSchema from '../modules/auth/middlewares/tenantMiddleware';


describe('Tenant Middleware', () => {
  it('should set tenant schema from header', () => {
    const req = {
      header: jest.fn().mockReturnValue('tenant1'),
    } as unknown as Request;
    const res = {
      locals: {},
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    setTenantSchema(req, res, next);

    expect(res.locals.tenant).toBe('tenant1');
    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if tenant header is missing', () => {
    const req = {
      header: jest.fn().mockReturnValue(null),
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    setTenantSchema(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Tenant ID is required');
    expect(next).not.toHaveBeenCalled();
  });
});
