import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchMonthlyRevenueDto } from 'src/modules/reports/dto';
import { MonthlyRevenue } from 'src/modules/reports/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(MonthlyRevenue)
    private readonly monthlyRevenueRepository: Repository<MonthlyRevenue>,
  ) {}

  public handleGetMonthlyRevenue = async (
    searchMonthlyRevenueDto?: SearchMonthlyRevenueDto,
  ) => {
    const { year, minRevenue, maxRevenue, month } =
      searchMonthlyRevenueDto || {};

    const queryBuilder =
      this.monthlyRevenueRepository.createQueryBuilder('revenue');

    if (minRevenue) {
      queryBuilder.andWhere('revenue.totalRevenue >= :minRevenue', {
        minRevenue,
      });
    }

    if (maxRevenue) {
      queryBuilder.andWhere('revenue.totalRevenue <= :maxRevenue', {
        maxRevenue,
      });
    }

    if (year) {
      queryBuilder.andWhere('revenue.month LIKE :year', { year: `${year}-%` });
    }

    return queryBuilder.getMany();
  };

  public handleGetMonthlyRevenueDetails = async (id: string) => {
    const monthlyRevenueDetails = await this.monthlyRevenueRepository.findOne({
      where: {
        id,
      },
    });

    if (!monthlyRevenueDetails)
      throw new NotFoundException(`Month revenue details not found.`);

    // return this.bookingDetailsService.getRevenueByRoomTypeInMonth(
    //   monthlyRevenueDetails.month,
    // );
  };

  public handleGetMonthlyRevenueMonthYear = async (monthYear: string) => {
    return this.monthlyRevenueRepository.findOne({
      where: {
        month: monthYear,
      },
    });
  };

  public handleCreateOrUpdateMonthlyRevenue = async (
    monthYear: string,
    revenue: number,
  ) => {
    const findMonthlyRevenue = await this.monthlyRevenueRepository.findOne({
      where: {
        month: monthYear,
      },
    });

    if (!findMonthlyRevenue) {
      const newMonthlyRevenue = this.monthlyRevenueRepository.create({
        month: monthYear,
        totalRevenue: revenue,
      });

      await this.monthlyRevenueRepository.save(newMonthlyRevenue);
    } else {
      const existingTotalRevenue = findMonthlyRevenue.totalRevenue;

      await this.monthlyRevenueRepository.update(
        {
          id: findMonthlyRevenue.id,
        },
        {
          totalRevenue: existingTotalRevenue + revenue,
        },
      );
    }
  };
}
