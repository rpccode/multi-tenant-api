import express from 'express';
import { authenticateJWT } from '../../auth/middlewares';
import setTenantSchema from '../../auth/middlewares/tenantMiddleware';
import { getAuditLogs } from '../controller';
import { authorize } from '../../auth/middlewares/authorizationMiddleware';


const router = express.Router();

router.use(setTenantSchema);
router.use(authenticateJWT);

router.get('/logs', authorize(['admin']), getAuditLogs);

export default router;
