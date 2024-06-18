import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IBoardCreatePayload, IBoardUpdatePayload, ISafeBoard } from './types';
import { Board } from './entities/board.entity';
import { get } from 'lodash';
import { instanceToPlain } from 'class-transformer';
import safeExecute from '../utils/safe-execute/safeExecute';

@Injectable()
export class BoardService {
  constructor(private readonly dataSource: DataSource) {}

  // method creates a board
  async create(boardCreatePayload: IBoardCreatePayload) {
    return safeExecute<string>({
      successMessage: 'Board create success',
      failureMessage: 'Board create fail',
      id: 'BOARD.SERVICE.CREATE',
    })(async () => {
      // insert record
      const boardCreateRes = await this.dataSource
        .getRepository(Board)
        .insert(boardCreatePayload);

      // define board id
      const boardId = get(boardCreateRes, 'identifiers[0].id');

      return boardId;
    });
  }

  // method returns all board by project
  async findByProject(projectId: string) {
    return safeExecute<ISafeBoard[]>({
      successMessage: 'Board find by project success',
      failureMessage: 'Board find by project fail',
      id: 'BOARD.SERVICE.FIND_BY_PROJECT',
    })(async () => {
      // get all boards
      const boards = await this.dataSource
        .getRepository(Board)
        .find({ where: { project: { id: projectId } }, relations: ['owner'] });

      // convert boards to plain
      const boardsPlain = boards.map((board) =>
        instanceToPlain(board),
      ) as ISafeBoard[];

      return boardsPlain;
    });
  }

  // finds board by id
  async findById(boardId: string) {
    return safeExecute<ISafeBoard>({
      successMessage: 'Board find by id success',
      failureMessage: 'Board find by id fail',
      id: 'BOARD.SERVICE.FIND_BY_ID',
    })(async () => {
      // get board by id
      const board = await this.dataSource
        .getRepository(Board)
        .findOne({ where: { id: boardId }, relations: ['owner'] });

      // convert project to plain
      const boardPlain = instanceToPlain(board) as ISafeBoard;

      return boardPlain;
    });
  }

  // method updates board
  async update({ boardUpdateDto, boardId }: IBoardUpdatePayload) {
    return safeExecute<string>({
      successMessage: 'Board update success',
      failureMessage: 'Board update fail',
      id: 'BOARD.SERVICE.UPDATE',
    })(async () => {
      // update board
      await this.dataSource
        .getRepository(Board)
        .update({ id: boardId }, boardUpdateDto);

      return boardId;
    });
  }

  // method removes board
  async remove(boardId: string) {
    return safeExecute<string>({
      successMessage: 'Project remove success',
      failureMessage: 'Board remove fail',
      id: 'BOARD.SERVICE.REMOVE',
    })(async () => {
      // remove board
      await this.dataSource.getRepository(Board).delete({ id: boardId });

      return boardId;
    });
  }
}
