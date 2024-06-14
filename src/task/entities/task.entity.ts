import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskGroup } from '../../task-group/entities/task-group.entity';
import { User } from '../../user/entities/user.entity';

@Entity('task')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, name: 'name' })
  name: string;

  @Column({ type: 'text', name: 'description' })
  description: string;

  @ManyToOne(() => TaskGroup, (group) => group.id)
  group: TaskGroup;

  @ManyToOne(() => User)
  owner: User | string;
}
