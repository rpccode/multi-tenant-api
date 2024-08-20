import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Frequency } from "./Frequency";

import { LoanState } from "./LoanState";
import { Person } from "../../auth/interfaces";

// Entity for LoanHeader
@Entity({ name: 'LoanHeader' })
export class LoanHeader extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'int' })
  person_id: number;

  @Column({ type: 'int' })
  frequency_id: number;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'int' })
  dues: number;

  @Column({ type: 'float' })
  interest: number;

  @Column({ type: 'timestamptz' })
  start_date: Date;

  @Column({ type: 'int' })
  state_id: number;

  @ManyToOne(() => Frequency, frequency => frequency.id)
  frequency: Frequency;

  @ManyToOne(() => Person, person => person.id)
  person: Person;

  @ManyToOne(() => LoanState, loanState => loanState.id)
  loanState: LoanState;
}