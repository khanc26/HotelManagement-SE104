import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class MaintenanceMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDate = now.getDate();

    const maintenanceStartTime = new Date(
      currentYear,
      currentMonth,
      currentDate,
      23,
      55,
      0,
    );

    const maintenanceEndTime = new Date(
      currentYear,
      currentMonth,
      currentDate + 1,
      0,
      0,
      0,
    );

    if (now >= maintenanceStartTime && now < maintenanceEndTime) {
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message:
          'The server is undergoing daily maintenance (23:55 - 00:00). Please try again later.',
      });
    }

    next();
  }
}
