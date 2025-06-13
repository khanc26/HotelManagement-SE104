import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchMonthlyRevenueDto } from 'src/modules/reports/dto';
import { MonthlyRevenue } from 'src/modules/reports/entities';
import { MonthlyRevenueDetail } from 'src/modules/reports/entities/monthly-revenue-detail.entity';
import { RoomTypesService } from 'src/modules/room-types/room-types.service';
import { Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(MonthlyRevenue)
    private readonly monthlyRevenueRepository: Repository<MonthlyRevenue>,
    @InjectRepository(MonthlyRevenueDetail)
    private readonly monthlyRevenueDetailRepository: Repository<MonthlyRevenueDetail>,
    private readonly roomTypesService: RoomTypesService,
  ) {}

  public handleGetMonthlyRevenue = async (
    searchMonthlyRevenueDto?: SearchMonthlyRevenueDto,
  ) => {
    const { year, minRevenue, maxRevenue } = searchMonthlyRevenueDto || {};

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

  public handleGetMonthlyRevenueDetails = async (month: string) => {
    const allRoomTypes = await this.roomTypesService.findAll();

    const details = await this.monthlyRevenueDetailRepository.find({
      where: { month },
      relations: {
        monthlyRevenue: true,
        roomType: true,
      },
    });

    const detailMap = new Map(
      details.map((detail) => [detail.roomTypeId, detail]),
    );

    const totalRevenue = details[0]?.monthlyRevenue?.totalRevenue ?? 0;

    const result = allRoomTypes.map((roomType) => {
      const detail = detailMap.get(roomType.id);
      const revenue = detail?.revenue ?? 0;
      const percentage = totalRevenue
        ? parseFloat(((revenue / totalRevenue) * 100).toFixed(2))
        : 0;

      return {
        roomTypeName: roomType.name,
        revenue,
        percentage,
      };
    });

    return result;
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
    room_type_id: string,
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
          month: findMonthlyRevenue.month,
        },
        {
          totalRevenue: existingTotalRevenue + revenue,
        },
      );
    }

    await this.handleUpdateMonthlyRevenueDetail(
      monthYear,
      room_type_id,
      revenue,
    );
  };

  private handleUpdateMonthlyRevenueDetail = async (
    month: string,
    room_type_id: string,
    revenue: number,
  ) => {
    const existingRecord = await this.monthlyRevenueDetailRepository.findOne({
      where: {
        month,
        roomTypeId: room_type_id,
      },
    });

    if (!existingRecord) {
      const newRecord = this.monthlyRevenueDetailRepository.create({
        month,
        roomTypeId: room_type_id,
        revenue,
      });

      await this.monthlyRevenueDetailRepository.save(newRecord);
    } else {
      await this.monthlyRevenueDetailRepository.update(
        {
          roomTypeId: room_type_id,
          month,
        },
        {
          revenue: existingRecord.revenue + revenue,
        },
      );
    }
  };
}
