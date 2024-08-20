import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../../config/data-source";


export const authorize = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const queryRunner = AppDataSource.createQueryRunner();
    const userId = res.locals.userId;
    const tenantName = res.locals.tenant; // Asegúrate de tener tenantName disponible
    if (!userId) return res.status(401).json({ message: "User ID required" });

    try {
      await queryRunner.connect();

      const user = await queryRunner.query(
        `SELECT "id" FROM "${tenantName}".users u WHERE u."id" = $1 LIMIT 1`,
        [userId]
      );
      // console.log({ user });

      if (!user || user.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const userWithRoles = await queryRunner.query(
        `SELECT u."id", r."name" AS role_name
         FROM "${tenantName}".users u
         JOIN "${tenantName}".roles r ON u."roleid" = r."id"
         WHERE u."id" = $1`,
        [userId]
      );
      console.log(userWithRoles)

      const userRole = userWithRoles.map((role) => role.role_name);

      if (!roles.some((role) => userRole.includes(role))) {
        return res.status(403).send("Access denied");
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error", error: error });
    } finally {
      await queryRunner.release();
    }
  };
};
