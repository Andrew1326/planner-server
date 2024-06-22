import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Board } from '../../board/entities/board.entity';

@Entity('task_group')
export class TaskGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', name: 'name' })
  name: string;

  @ManyToOne(() => User)
  owner: User | string;

  @ManyToOne(() => Board, { onDelete: 'CASCADE' })
  board: Board | string;
}
