import express from 'express';
import setTenantSchema from '../../auth/middlewares/tenantMiddleware';
import { authenticateJWT } from '../../auth/middlewares/authMiddleware';
import { authorize } from '../../auth/middlewares/authorizationMiddleware';
import { CreateMultiplePersona, CreatePerson, updatePersona } from '../controller/PersonController';


const router = express.Router();

router.use(setTenantSchema);
router.use(authenticateJWT);

router.post('/',authorize(['Admin']), CreatePerson);
router.post('/register',authorize(['Admin']), CreateMultiplePersona);
router.put('/modify/:id',authorize(['Admin']), updatePersona)
 



export default router;
