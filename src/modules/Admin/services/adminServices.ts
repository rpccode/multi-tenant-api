import { AppDataSource } from "../../../config";


export const createAdminTenan = async (name:string, superUser:string,planId:number) => {
  console.log(name , superUser , planId)
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const tenantId =  await queryRunner.query(
      `
        INSERT INTO admin.tenant ( name, superUser, lastSync, lastSyncError, createdAt, updatedAt) VALUES
        ($1, $2, NOW(), NOW(), NOW(), NOW()) RETURNING id
        `,
      [name,superUser]
    );

    await queryRunner.query(
      `
        INSERT INTO admin.subscriptions (tenant_id, plan_id, start_date, end_date, status) VALUES
        ($1, $2, NOW(), NOW() + INTERVAL '1 month', 'active')
        `,
        [tenantId[0].id,planId]
    )

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};
