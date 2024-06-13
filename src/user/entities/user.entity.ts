import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../role/role.enum';
import { Exclude } from 'class-transformer';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'text' })
  name: string;

  @Column({ name: 'email', type: 'text' })
  email: string;

  @Column({ name: 'password', type: 'text' })
  @Exclude()
  password: string;

  @Column({ name: 'roles', type: 'text', array: true, nullable: true })
  roles: Role[];
}
