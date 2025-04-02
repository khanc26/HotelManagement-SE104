import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Configuration {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column()
  configName!: string;

  @Column({ type: 'float' })
  configValue!: number;
}
