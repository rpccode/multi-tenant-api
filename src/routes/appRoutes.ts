import * as express from 'express';
import auditRoutes from '../modules/Admin/routes/auditRoutes';
import SeedRoutes from '../modules/Admin/routes/SeedRoutes';
import authRoutes from '../modules/auth/routes/authRoutes';
import userRoutes from '../modules/auth/routes/userRoutes';
import personRoutes from '../modules/loan/routes/personRoutes';



const router = express.Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/person", personRoutes);
router.use("/seed", SeedRoutes);
router.use("/audit", auditRoutes);






export default router