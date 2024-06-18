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
import { AnalyticsService } from '../utils/analytics/analytics.service';

@Injectable()
export class ProjectService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly analyticsService: AnalyticsService,
  ) {}

  // method creates a project
  async create(projectCreatePayload: IProjectCreatePayload) {
    return this.analyticsService.provideAnalytics<string>({
      successMessage: 'Project create success',
      failureMessage: 'Project create fail',
      id: 'PROJECT.SERVICE.CREATE',
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
    return this.analyticsService.provideAnalytics<ISafeProject[]>({
      successMessage: 'Projects by user success',
      failureMessage: 'Project by user find fail',
      id: 'PROJECT.SERVICE.FIND_BY_USER',
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
    return this.analyticsService.provideAnalytics<ISafeProject>({
      successMessage: 'Project find by id success',
      failureMessage: 'Project find by id fail',
      id: 'PROJECT.SERVICE.FIND_BY_ID',
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
    return this.analyticsService.provideAnalytics<string>({
      successMessage: 'Project update success',
      failureMessage: 'Project update fail',
      id: 'PROJECT.SERVICE.UPDATE',
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
    return this.analyticsService.provideAnalytics<string>({
      successMessage: 'Project remove success',
      failureMessage: 'Project remove fail',
      id: 'PROJECT.SERVICE.REMOVE',
    })(async () => {
      // remove project
      await this.dataSource.getRepository(Project).delete({ id: projectId });

      return projectId;
    });
  }
}
