import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Project } from '../../project/entities/project.entity';
import { TaskGroup } from '../../task-group/entities/task-group.entity';

@Entity('board')
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, name: 'name' })
  name: string;

  @Column({ type: 'varchar', length: 255, name: 'description' })
  description: string;

  @ManyToOne(() => User)
  owner: User | string;

  @ManyToOne(() => Project, (project) => project.board)
  project: Project | string;

  @OneToMany(() => TaskGroup, (taskGroup) => taskGroup.board, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  task_groups: TaskGroup | string;
}
