import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

// Entity for LoanState
@Entity({ name: 'LoanState' })
export class LoanState extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  name: string;

  @Column({ type: 'boolean', default: true })
  state: boolean;
}
