import express from 'express';
import {createAdminTable, createUserAndTenant, singIn, validateTenant } from '../controller/authController';
import setTenantSchema from '../middlewares/tenantMiddleware';


const router = express.Router();
   


router.use(setTenantSchema);
router.post('/login', singIn);
router.post('/register', createUserAndTenant);
router.get('/validate/:tenant', validateTenant)






export default router;
