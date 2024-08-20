import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

// Entity for LoanConfiguration
@Entity({ name: 'LoanConfiguration' })
export class LoanConfiguration extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  config_name: string;

  @Column({ type: 'varchar', length: 255 })
  config_value: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;
}