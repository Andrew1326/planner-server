import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from '../../task/entities/task.entity';
import { User } from '../../user/entities/user.entity';
import { Board } from '../../board/entities/board.entity';

@Entity('task_group')
export class TaskGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, name: 'name' })
  name: string;

  @OneToMany(() => Task, (task) => task.group, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  tasks: Task[];

  @ManyToOne(() => User)
  owner: User | string;

  @ManyToOne(() => Board, (board) => board.task_groups)
  board: Board | string;
}
