import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { LoanHeader } from "./LoanHeader";
import { LoanState } from "./LoanState";

// Entity for LoanDetail
@Entity({ name: 'LoanDetail' })
export class LoanDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  loan_id: number;

  @Column({ type: 'int' })
  dues_num: number;

  @Column({ type: 'float' })
  dues_amount: number;

  @Column({ type: 'float' })
  total_amount: number;

  @Column({ type: 'float' })
  total_interest: number;

  @Column({ type: 'timestamptz' })
  start_date: Date;

  @Column({ type: 'int' })
  state_id: number;

  @ManyToOne(() => LoanHeader, loanHeader => loanHeader.id)
  loanHeader: LoanHeader;

  @ManyToOne(() => LoanState, loanState => loanState.id)
  loanState: LoanState;
}