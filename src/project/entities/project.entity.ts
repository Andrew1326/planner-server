import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Board } from '../../board/entities/board.entity';

@Entity('project')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, name: 'name' })
  name: string;

  @Column({ type: 'varchar', length: 255, name: 'description' })
  description: string;

  @ManyToOne(() => User)
  owner: User | string;

  @OneToMany(() => Board, (board) => board.project, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  board: Board[] | string[];
}
