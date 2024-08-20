import request from 'supertest';
import { AppDataSource } from '../config';
import { app } from '../app';
import { AuditLog } from '../entity';


beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe('Audit Controller', () => {
  it('should get paginated audit logs', async () => {
    const response = await request(app)
      .get('/audit/logs?page=1&limit=2')
      .set('X-Tenant-ID', 'tenant1')
      .set('Authorization', 'Bearer your_jwt_token');

    expect(response.status).toBe(200);
    expect(response.body.logs.length).toBeLessThanOrEqual(2);
    expect(response.body.total).toBeDefined();
  });

  it('should filter audit logs by action', async () => {
    const response = await request(app)
      .get('/audit/logs?action=create')
      .set('X-Tenant-ID', 'tenant1')
      .set('Authorization', 'Bearer your_jwt_token');

    expect(response.status).toBe(200);
    response.body.logs.forEach((log: AuditLog) => {
      expect(log.action).toBe('create');
    });
  });

  it('should filter audit logs by entity', async () => {
    const response = await request(app)
      .get('/audit/logs?entity=user')
      .set('X-Tenant-ID', 'tenant1')
      .set('Authorization', 'Bearer your_jwt_token');

    expect(response.status).toBe(200);
    response.body.logs.forEach((log: AuditLog) => {
      expect(log.entity).toBe('user');
    });
  });

  it('should sort audit logs by timestamp', async () => {
    const response = await request(app)
      .get('/audit/logs?sortField=timestamp&sortOrder=ASC')
      .set('X-Tenant-ID', 'tenant1')
      .set('Authorization', 'Bearer your_jwt_token');

    expect(response.status).toBe(200);
    const logs = response.body.logs;
    for (let i = 1; i < logs.length; i++) {
      expect(new Date(logs[i - 1].timestamp) <= new Date(logs[i].timestamp)).toBe(true);
    }
  });

  it('should sort audit logs by action', async () => {
    const response = await request(app)
      .get('/audit/logs?sortField=action&sortOrder=DESC')
      .set('X-Tenant-ID', 'tenant1')
      .set('Authorization', 'Bearer your_jwt_token');

    expect(response.status).toBe(200);
    const logs = response.body.logs;
    for (let i = 1; i < logs.length; i++) {
      expect(logs[i - 1].action >= logs[i].action).toBe(true);
    }
  });

  it('should filter audit logs by date range', async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const endDate = new Date();

    const response = await request(app)
      .get(`/audit/logs?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
      .set('X-Tenant-ID', 'tenant1')
      .set('Authorization', 'Bearer your_jwt_token');

    expect(response.status).toBe(200);
    response.body.logs.forEach((log: AuditLog) => {
      const logDate = new Date(log.timestamp);
      expect(logDate >= startDate && logDate <= endDate).toBe(true);
    });
  });
});
