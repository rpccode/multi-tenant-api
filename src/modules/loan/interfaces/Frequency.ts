
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, BaseEntity } from 'typeorm';

// Entity for Frequency
@Entity({ name: 'Frequency' })
export class Frequency extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  name: string;

  @Column({ type: 'int' })
  fnumber: number;

  @Column({ type: 'boolean', default: true })
  state: boolean;
}