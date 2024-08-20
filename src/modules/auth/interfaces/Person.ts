import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// Entity for Person
@Entity({ name: 'Person' })
export class Person extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  personType_id: number;

  @Column({ type: 'varchar', length: 10 })
  typeDni: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  dni?: string;

  @Column({ type: 'varchar', length: 100 })
  first_name: string;

  @Column({ type: 'varchar', length: 100 })
  last_name: string;

  @Column({ type: 'int', nullable: true })
  address?: number;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  @Column({ type: 'varchar', length: 50 })
  email: string;

  @Column({ type: 'int', nullable: true })
  position?: number;

  @Column({ type: 'boolean', default: true })
  state: boolean;
}