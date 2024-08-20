import express from "express";
import setTenantSchema from "../middlewares/tenantMiddleware";
import { authorize } from "../middlewares/authorizationMiddleware";
import { authenticateJWT } from "../middlewares";
import { registerUser, changeUserRole, removeUser, removeRole, listUsers, updateUserData, assignPermission } from "../controller";


const router = express.Router();

router.use(setTenantSchema);
router.use(authenticateJWT);

router.post("/create_user", authorize(["Admin"]), registerUser);
router.post("/update-role", authorize(["Admin"]), changeUserRole);
router.delete("/remove-user", authorize(["Admin"]), removeUser);
router.delete("/remove-role", authorize(["Admin"]), removeRole);
router.get("/list-users", authorize(["Admin"]), listUsers);
router.put("/update-user", authorize(["Admin"]), updateUserData);
router.post("/assign-permission", authorize(["Admin"]), assignPermission);

export default router;
