import { Project } from './entities/project.entity';
import { User } from '../user/entities/user.entity';
import { ProjectCreateDto } from './dto/project-create.dto';
import { ProjectUpdateDto } from './dto/project-update.dto';

export interface ISafeProject extends Omit<Project, 'owner'> {
  owner: Omit<User, 'password'>;
}

export interface IProjectCreatePayload extends ProjectCreateDto {
  owner: string;
}

export interface IProjectUpdatePayload {
  projectUpdateDto: ProjectUpdateDto;
  projectId: string;
}
