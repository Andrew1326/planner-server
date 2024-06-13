import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  AnalyticsService,
  IAnalytics,
} from '../utils/analytics/analytics.service';
import { IBoardCreatePayload, IBoardUpdatePayload, ISafeBoard } from './types';
import { Board } from './entities/board.entity';
import { get } from 'lodash';
import { instanceToPlain } from 'class-transformer';
import { ISafeProject } from '../project/types';

@Injectable()
export class BoardService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly analytics: AnalyticsService,
  ) {}

  // method creates a board
  async create(
    boardCreatePayload: IBoardCreatePayload,
  ): Promise<IAnalytics<string | Error>> {
    try {
      // insert record
      const boardCreateRes = await this.dataSource
        .getRepository(Board)
        .insert(boardCreatePayload);

      // define board id
      const boardId = get(boardCreateRes, 'identifiers[0].id');

      return this.analytics.success<string>({
        message: 'Board created.',
        payload: boardId,
      });
    } catch (err) {
      // analytics fail
      return this.analytics.fail<Error>({
        message: 'Board create fail.',
        payload: err,
      });
    }
  }

  // method returns all board by project
  async findByProject(
    projectId: string,
  ): Promise<IAnalytics<ISafeBoard[] | Error>> {
    try {
      // get all boards
      const boards = await this.dataSource
        .getRepository(Board)
        .find({ where: { project: projectId }, relations: ['owner'] });

      // convert boards to plain
      const plainBoards = boards.map((board) =>
        instanceToPlain(board),
      ) as ISafeBoard[];

      // analytics success
      return this.analytics.success({
        message: 'Boards were found.',
        payload: plainBoards,
      });
    } catch (err) {
      // analytics fail
      return this.analytics.fail<Error>({
        message: 'Board find all fail.',
        payload: err,
      });
    }
  }

  // finds board by id
  async findById(boardId: string): Promise<IAnalytics<ISafeBoard | Error>> {
    try {
      // get board by id
      const board = await this.dataSource
        .getRepository(Board)
        .findOne({ where: { id: boardId }, relations: ['owner'] });

      // convert project to plain
      const plainBoard = instanceToPlain(board) as ISafeProject;

      // analytics success
      return this.analytics.success({
        message: 'Board was found.',
        payload: plainBoard,
      });
    } catch (err) {
      // analytics fail
      return this.analytics.fail<Error>({
        message: 'Board find by id fail.',
        payload: err,
      });
    }
  }

  // method updates board
  async update({
    boardUpdateDto,
    boardId,
  }: IBoardUpdatePayload): Promise<IAnalytics<string | Error>> {
    try {
      // update board
      await this.dataSource
        .getRepository(Board)
        .update({ id: boardId }, boardUpdateDto);

      // analytics success
      return this.analytics.success({
        message: 'Board updated.',
        payload: boardId,
      });
    } catch (err) {
      // analytics fail
      return this.analytics.fail<Error>({
        message: 'Board update fail.',
        payload: err,
      });
    }
  }

  // method removes board
  async remove(boardId: string): Promise<IAnalytics<string | Error>> {
    try {
      // remove board
      await this.dataSource.getRepository(Board).delete({ id: boardId });

      // analytics success
      return this.analytics.success({
        message: 'Project removed.',
        payload: boardId,
      });
    } catch (err) {
      // analytics fail
      return this.analytics.fail<Error>({
        message: 'Board remove fail.',
        payload: err,
      });
    }
  }
}
