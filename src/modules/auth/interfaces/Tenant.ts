import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    nullable: false
  })
  name: string 

  @Column({
    nullable: false,
    unique: true,
  })
  SuperUser: string

  @Column({
    type: 'jsonb',
    default: {},
  })
  settings: any

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastSync: Date

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  lastSyncError: Date

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  updatedAt: Date



}
