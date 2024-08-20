import { Request, Response } from 'express';
import { AuditLog } from '../interfaces';
import { AppDataSource } from '../../../config';

export const getAuditLogs = async (req: Request, res: Response) => {
  const auditLogRepository = AppDataSource.getRepository(AuditLog);
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const action = req.query.action as string;
  const entity = req.query.entity as string;
  const sortField = req.query.sortField as string || 'timestamp';
  const sortOrder = req.query.sortOrder as string || 'DESC';
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;

  try {
    const query = auditLogRepository.createQueryBuilder('auditLog');
    
    if (action) {
      query.andWhere('auditLog.action = :action', { action });
    }

    if (entity) {
      query.andWhere('auditLog.entity = :entity', { entity });
    }

    if (startDate) {
      query.andWhere('auditLog.timestamp >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('auditLog.timestamp <= :endDate', { endDate });
    }

    const [logs, total] = await query
      .orderBy(`auditLog.${sortField}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    res.status(200).json({
      logs,
      total,
      page,
      limit,
    });
  } catch (error) {
    res.status(500).send('Error fetching audit logs');
  }
};
