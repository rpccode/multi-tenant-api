import { AppDataSource } from "../../../config";
import { Person } from "../../auth/interfaces";
import { logAudit } from "../../auth/services/schemaService";
import { CreatePersonDto } from "../class/dtos/person/CreatePersonDto";
import { UpdatePersonDto } from "../class/dtos/person/UpdatePersonDto";

export const createPerson = async (tenantName: string, person: CreatePersonDto) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
console.log({person})
  try {
    await queryRunner.query(
      `INSERT INTO "${tenantName}"."Person" (
             "infoType_id" , "typeDni" , dni, first_name, last_name, address, telefono, email, "position", "state"
             ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
              )`,
      [
        person.personType_id,
        person.typeDni,
        person.dni,
        person.first_name,
        person.last_name,
        person.address,
        person.telefono,
        person.email,
        person.position,
        person.state,
      ]
    );

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

export const deletePerson = async (tenantName: string, id: string) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    await queryRunner.query(
      `DELETE FROM "${tenantName}".person WHERE ¨id¨ = $1`,
      [id]
    );
    await logAudit("delete", "person", id, `User ${id} deleted`);
    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

export const getPersons = async (
  tenantName: string,
  page: number,
  limit: number,
  search: string,
  search2: string
) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    const offset = (page - 1) * limit;
    const query = `
        SELECT *
        FROM "${tenantName}"."Person"
        WHERE "${tenantName}".first_name ILIKE $1
        AND "${tenantName}".last_name ILIKE $2
        LIMIT $3 OFFSET $4
      `;
    const person = await queryRunner.query(query, [
      `%${search}%`,
      `%${search2}%`,
      limit,
      offset,
    ]);

    const countQuery = `
        SELECT COUNT(*) 
        FROM "${tenantName}"."Person" p
        WHERE p.first_name ILIKE $1
      `;
    const total = await queryRunner.query(countQuery, [`%${search}%`]);

    return {
      person,
      total: parseInt(total[0].count, 10),
      page,
      limit,
    };
  } catch (error) {
    throw error;
  } finally {
    await queryRunner.release();
  }
};

export const getOnePerson = async (tenantName: string, id: string) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  try {
    const person = await queryRunner.query(
      `SELECT * FROM "${tenantName}"."Person" WHERE id = $1`,
      [id]
    );
    return person[0];
  } catch (error) {
    throw error;
  } finally {
    await queryRunner.release();
  }
};

export const CreateMultiplePerson = async (
  tenantName: string,
  persons: Person[]
) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    for (const person of persons) {
      await queryRunner.query(
        `INSERT INTO "${tenantName}"."Person" (
                         infoType_id, typeDni, dni, first_name, last_name, address, telefono, email, position, state
                         ) VALUES (
                          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
                          )`,
        [
          person.personType_id,
          person.typeDni,
          person.dni,
          person.first_name,
          person.last_name,
          person.address,
          person.telefono,
          person.email,
          person.position,
          person.state,
        ]
      );
      await logAudit(
        "create",
        "person",
        person.id,
        `User ${person.id} created`
      );
    }

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

export const updatePerson = async (tenantName: string, person: UpdatePersonDto, id:string) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    await queryRunner.query(
      `UPDATE "${tenantName}"."Person"
            SET  "infoType_id" = $1, "typeDni" = $2, dni = $3, first_name = $4, last_name = $5, address = $6, telefono = $7, email = $8, "position" = $9, "state" = $10
            WHERE "id"= $11`,
      [
        id,
        person.personType_id,
        person.typeDni,
        person.dni,
        person.first_name,
        person.last_name,
        person.address,
        person.telefono,
        person.email,
        person.position,
        person.state,
       
      ]
    );
    await logAudit("update", "person", person.id, `User ${person.id} updated`);
    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

export const udateMultiplePersons = async (tenantName: string,
    persons: Person[]) => {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const person of persons) {
                await queryRunner.query(
                    `UPDATE "${tenantName}"."Person"
                            SET infoType_id = $1, typeDni = $2, dni = $3, first_name = $4, last_name = $5, address = $6, telefono = $7, email = $8, position = $9, state = $10
                            WHERE id = $11`,
                    [
                        person.personType_id,
                        person.typeDni,
                        person.dni,
                        person.first_name,
                        person.last_name,
                        person.address,
                        person.telefono,
                        person.email,
                        person.position,
                        person.state,
                        person.id,
                    ]
                );
                await logAudit("update", "person", person.id, `User ${person.id} updated`);
            }
            
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
            
        }
        finally {
            await queryRunner.release();
        }

}
