import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskGroup } from '../../task-group/entities/task-group.entity';
import { User } from '../../user/entities/user.entity';

@Entity('task')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', name: 'name' })
  name: string;

  @Column({ type: 'text', name: 'description' })
  description: string;

  @ManyToOne(() => TaskGroup, { onDelete: 'CASCADE' })
  group: TaskGroup | string;

  @ManyToOne(() => User)
  owner: User | string;
}
