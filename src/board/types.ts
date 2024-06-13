import { BoardCreateDto } from './dto/board-create.dto';
import { User } from '../user/entities/user.entity';
import { Project } from '../project/entities/project.entity';
import { BoardUpdateDto } from './dto/board-update.dto';

export interface IBoardCreatePayload {
  boardCreateDto: BoardCreateDto;
  owner: User;
}

export interface IBoardUpdatePayload {
  boardUpdateDto: Omit<BoardUpdateDto, 'project'>;
  boardId: string;
}

export interface ISafeBoard extends Omit<Project, 'owner'> {
  owner: Omit<User, 'password'>;
}
