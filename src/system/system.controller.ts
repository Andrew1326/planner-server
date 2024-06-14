import { Controller, HttpStatus, Patch, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { SystemService } from "./system.service";
import { AuthJwtGuard } from "../auth/auth-jwt.guard";

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {
  }

  // route drops database
  @UseGuards(AuthJwtGuard)
  @Patch('database/drop')
  async databaseDrop(@Req() req: Request, @Res() res: Response) {
  // drop database
    const dropDatabaseRes = await this.systemService.databaseDrop();

  // define http status based on database drop result
    const httpStatus: number = dropDatabaseRes.fail ? HttpStatus.BAD_REQUEST : HttpStatus.OK;

    res.status(httpStatus).json(dropDatabaseRes);
  }
}
