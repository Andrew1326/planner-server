import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { BoardService } from './board.service';
import { BoardCreateDto } from './dto/board-create.dto';
import { BoardUpdateDto } from './dto/board-update.dto';
import { get } from 'lodash';
import { ISessionUser } from '../user/types';
import { UserService } from '../user/user.service';
import { AuthJwtGuard } from '../auth/auth-jwt.guard';
import { IBoardCreatePayload } from './types';
import { TaskGroupService } from '../task-group/task-group.service';
import { AnalyticsService } from '../utils/analytics/analytics.service';

@Controller('board')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly userService: UserService,
    private readonly taskGroupService: TaskGroupService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  // route for board creation
  @UseGuards(AuthJwtGuard)
  @Post()
  async create(
    @Body() boardCreateDto: BoardCreateDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const sessionUser = get(req, 'user') as ISessionUser;
    const email = get(sessionUser, 'email', '');

    // get user by email
    const userGetRes = await this.userService.getByEmail(email);

    // fail if user wasn't received
    if (userGetRes.fail) {
      return res.status(HttpStatus.BAD_REQUEST).json(userGetRes);
    }

    // define board owner id
    const boardOwnerId: string = get(userGetRes, 'payload.id', '');

    // define board create payload
    const boardCreatePayload: IBoardCreatePayload = {
      ...boardCreateDto,
      owner: boardOwnerId,
    };

    // create board
    const boardCreateRes = await this.boardService.create(boardCreatePayload);

    // define http status based on board creation result
    const httpStatus: number =
      this.analyticsService.defineHttpStatus(boardCreateRes);

    res.status(httpStatus).json(boardCreateRes);
  }

  // method for receiving board by id
  @UseGuards(AuthJwtGuard)
  @Get(':id')
  async findOne(@Param('id') boardId: string, @Res() res: Response) {
    // find board by id
    const boardFindRes = await this.boardService.findById(boardId);

    // define http status based on board find result
    const httpStatus: number =
      this.analyticsService.defineHttpStatus(boardFindRes);

    res.status(httpStatus).json(boardFindRes);
  }

  // route for project modification
  @UseGuards(AuthJwtGuard)
  @Patch(':id')
  async update(
    @Param('id') boardId: string,
    @Body() boardUpdateDto: BoardUpdateDto,
    @Res() res: Response,
  ) {
    // update board
    const boardUpdateRes = await this.boardService.update({
      boardUpdateDto,
      boardId,
    });

    // define http status based on board update result
    const httpStatus: number =
      this.analyticsService.defineHttpStatus(boardUpdateRes);

    res.status(httpStatus).json(boardUpdateRes);
  }

  // route for board deletion
  @UseGuards(AuthJwtGuard)
  @Delete(':id')
  async remove(@Param('id') boardId: string, @Res() res: Response) {
    // remove board
    const boardRemoveRes = await this.boardService.remove(boardId);

    // define http status based on board remove result
    const httpStatus: number =
      this.analyticsService.defineHttpStatus(boardRemoveRes);

    res.status(httpStatus).json(boardRemoveRes);
  }

  // route for receiving task groups by board
  @UseGuards(AuthJwtGuard)
  @Get(':id/task-group')
  async taskGroupFindByBoard(
    @Param('id') boardId: string,
    @Res() res: Response,
  ) {
    // find task groups by board
    const taskGroupFindRes = await this.taskGroupService.findByBoard(boardId);

    // define http status based on task group find result
    const httpStatus: number =
      this.analyticsService.defineHttpStatus(taskGroupFindRes);

    res.status(httpStatus).json(taskGroupFindRes);
  }
}
