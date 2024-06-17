import { Injectable } from '@nestjs/common';
import { Project } from './entities/project.entity';
import { DataSource } from 'typeorm';
import { get } from 'lodash';
import { instanceToPlain } from 'class-transformer';
import {
  IProjectCreatePayload,
  IProjectUpdatePayload,
  ISafeProject,
} from './types';
import safeExecute from '../utils/safe-execute/safeExecute';

@Injectable()
export class ProjectService {
  constructor(private readonly dataSource: DataSource) {}

  // method creates a project
  async create(projectCreatePayload: IProjectCreatePayload) {
    return safeExecute<string>({
      successMessage: 'Project created',
      failureMessage: 'Project create fail',
    })(async () => {
      // insert record
      const projectCreateRes = await this.dataSource
        .getRepository(Project)
        .insert(projectCreatePayload);

      // define project id
      const projectId = get(projectCreateRes, 'identifiers[0].id');

      return projectId;
    });
  }

  // methods returns all project by user
  async findByUser(userId: string) {
    return safeExecute<ISafeProject[]>({
      successMessage: 'Projects by user were found',
      failureMessage: 'Project by user find fail',
    })(async () => {
      // get all projects
      const projects = await this.dataSource
        .getRepository(Project)
        .find({ where: { owner: { id: userId } } });

      // convert projects to plain
      const plainProjects = projects.map((project) =>
        instanceToPlain(project),
      ) as ISafeProject[];

      return plainProjects;
    });
  }

  // method returns project by id
  async findById(projectId: string) {
    return safeExecute<ISafeProject>({
      successMessage: 'Project was found',
      failureMessage: 'Project find by id fail',
    })(async () => {
      // get project by id
      const project = await this.dataSource
        .getRepository(Project)
        .findOne({ where: { id: projectId }, relations: ['owner'] });

      // convert project to plain
      const plainProject = instanceToPlain(project) as ISafeProject;

      return plainProject;
    });
  }

  // method updates project
  async update({ projectUpdateDto, projectId }: IProjectUpdatePayload) {
    return safeExecute<string>({
      successMessage: 'Project updated',
      failureMessage: 'Project update fail',
    })(async () => {
      // update project
      await this.dataSource
        .getRepository(Project)
        .update({ id: projectId }, projectUpdateDto);

      return projectId;
    });
  }

  // method removes project
  async remove(projectId: string) {
    return safeExecute<string>({
      successMessage: 'Project removed',
      failureMessage: 'Project remove fail',
    })(async () => {
      // remove project
      await this.dataSource.getRepository(Project).delete({ id: projectId });

      return projectId;
    });
  }
}
