import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { LoanHeader } from "../modules/loan/interfaces/LoanHeader";
import { LoanState } from "../modules/loan/interfaces/LoanState";

/// Entity for Payment
@Entity({ name: 'Payment' })
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  loan_id: number;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'int', nullable: true })
  payment_number?: number;

  @Column({ type: 'float' })
  balance: number;

  @Column({ type: 'float' })
  capital: number;

  @Column({ type: 'float' })
  interest: number;

  @Column({ type: 'float' })
  dues: number;

  @Column({ type: 'float' })
  payment_amount: number;

  @Column({ type: 'int' })
  state_id: number;

  @ManyToOne(() => LoanHeader, loanHeader => loanHeader.id)
  loanHeader: LoanHeader;

  @ManyToOne(() => LoanState, loanState => loanState.id)
  loanState: LoanState;
}