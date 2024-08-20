import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;

  @Column()
  entity: string;

  @Column()
  entityId:string;

  @Column()
  details: string;

  @CreateDateColumn()
  timestamp: Date;
}
