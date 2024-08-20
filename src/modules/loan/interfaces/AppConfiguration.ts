import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

// Entity for AppConfiguration
@Entity({ name: 'AppConfiguration' })
export class AppConfiguration extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  config_name: string;

  @Column({ type: 'varchar', length: 255 })
  config_value: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;
}