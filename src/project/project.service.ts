import { Injectable } from '@nestjs/common';
import {
  AnalyticsService,
  IAnalytics,
} from '../utils/analytics/analytics.service';
import { Project } from './entities/project.entity';
import { DataSource } from 'typeorm';
import { get } from 'lodash';
import { instanceToPlain } from 'class-transformer';
import {
  IProjectCreatePayload,
  IProjectUpdatePayload,
  ISafeProject,
} from './types';

@Injectable()
export class ProjectService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly analytics: AnalyticsService,
  ) {}

  // method creates a project
  async create(
    projectCreatePayload: IProjectCreatePayload,
  ): Promise<IAnalytics<string | Error>> {
    try {
      // insert record
      const projectCreateRes = await this.dataSource
        .getRepository(Project)
        .insert(projectCreatePayload);

      // define project id
      const projectId = get(projectCreateRes, 'identifiers[0].id');

      // analytics success
      return this.analytics.success({
        message: 'Project created.',
        payload: projectId,
      });
    } catch (err) {
      // analytics fail
      return this.analytics.fail({
        message: 'Project create fail.',
        payload: err,
      });
    }
  }

  // methods returns all project by user
  async findByUser(userId: string): Promise<IAnalytics<ISafeProject[] | Error>> {
    try {
      console.log(userId)
      // get all projects
      const projects = await this.dataSource
        .getRepository(Project)
        .find({ where: { owner: { id: userId } }, relations: ['owner'] });

      // convert projects to plain
      const plainProjects = projects.map((project) =>
        instanceToPlain(project),
      ) as ISafeProject[];

      // analytics success
      return this.analytics.success({
        message: 'Projects by user were found.',
        payload: plainProjects,
      });
    } catch (err) {
      // analytics fail
      return this.analytics.fail({
        message: 'Project by user find fail.',
        payload: err,
      });
    }
  }

  // method returns project by id
  async findById(projectId: string): Promise<IAnalytics<ISafeProject | Error>> {
    try {
      // get project by id
      const project = await this.dataSource
        .getRepository(Project)
        .findOne({ where: { id: projectId }, relations: ['owner'] });

      // convert project to plain
      const plainProject = instanceToPlain(project) as ISafeProject;

      // analytics success
      return this.analytics.success({
        message: 'Project was found.',
        payload: plainProject,
      });
    } catch (err) {
      // analytics fail
      return this.analytics.fail({
        message: 'Project find by id fail.',
        payload: err,
      });
    }
  }

  // method updates project
  async update({
    projectUpdateDto,
    projectId,
  }: IProjectUpdatePayload): Promise<IAnalytics<string | Error>> {
    try {
      // update project
      await this.dataSource
        .getRepository(Project)
        .update({ id: projectId }, projectUpdateDto);

      // analytics success
      return this.analytics.success({
        message: 'Project updated.',
        payload: projectId,
      });
    } catch (err) {
      // analytics fail
      return this.analytics.fail({
        message: 'Project update fail.',
        payload: err,
      });
    }
  }

  // method removes project
  async remove(projectId: string) {
    try {
      // remove project
      await this.dataSource.getRepository(Project).delete({ id: projectId });

      // analytics success
      return this.analytics.success({
        message: 'Project removed.',
        payload: projectId,
      });
    } catch (err) {
      // analytics fail
      return this.analytics.fail({
        message: 'Project remove fail.',
        payload: err,
      });
    }
  }
}
