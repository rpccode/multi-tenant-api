import * as express from 'express';
import { createAdminTable } from '../../auth/controller/authController';


const router = express.Router();


router.post('/admin', createAdminTable)






export default  router