import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import {
  CreateRoomTypeDto,
  UpdateRoomTypeDto,
  CreateRoomDto,
  UpdateRoomDto,
  CreatePricingRuleDto,
} from "./dto/rooms.dto";

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async createRoomType(dto: CreateRoomTypeDto) {
    return this.prisma.roomType.create({ data: dto });
  }

  async updateRoomType(id: string, dto: UpdateRoomTypeDto) {
    await this.findRoomTypeOrFail(id);
    return this.prisma.roomType.update({ where: { id }, data: dto });
  }

  async deleteRoomType(id: string) {
    await this.findRoomTypeOrFail(id);
    const activeBookings = await this.prisma.booking.count({
      where: {
        room: { roomTypeId: id },
        status: {
          in: ["PENDING_PAYMENT", "PAYING", "CONFIRMED", "CHECKED_IN"],
        },
      },
    });
    if (activeBookings > 0) {
      throw new BadRequestException(
        "Không thể xóa loại phòng đang có đơn đặt phòng hoạt động",
      );
    }
    await this.prisma.roomType.update({
      where: { id },
      data: { isActive: false },
    });
    return { message: "Đã vô hiệu hóa loại phòng" };
  }

  async listRoomTypes(includeInactive = false) {
    return this.prisma.roomType.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        pricingRules: {
          where: { isActive: true },
          orderBy: { priority: "desc" },
        },
        _count: { select: { rooms: true } },
      },
    });
  }

  async getRoomType(id: string) {
    const rt = await this.prisma.roomType.findUnique({
      where: { id },
      include: { pricingRules: { where: { isActive: true } }, rooms: true },
    });
    if (!rt) throw new NotFoundException("Loại phòng không tồn tại");
    return rt;
  }

  async createRoom(dto: CreateRoomDto) {
    const existing = await this.prisma.room.findUnique({
      where: { roomNumber: dto.roomNumber },
    });
    if (existing) throw new ConflictException("Số phòng đã tồn tại");
    await this.findRoomTypeOrFail(dto.roomTypeId);
    return this.prisma.room.create({ data: dto, include: { roomType: true } });
  }

  async updateRoom(id: string, dto: UpdateRoomDto) {
    await this.findRoomOrFail(id);
    return this.prisma.room.update({
      where: { id },
      data: dto,
      include: { roomType: true },
    });
  }

  async deleteRoom(id: string) {
    await this.findRoomOrFail(id);
    const active = await this.prisma.booking.count({
      where: { roomId: id, status: { in: ["CONFIRMED", "CHECKED_IN"] } },
    });
    if (active > 0)
      throw new BadRequestException("Phòng đang có khách, không thể xóa");
    await this.prisma.room.delete({ where: { id } });
    return { message: "Đã xóa phòng" };
  }

  async listRooms(roomTypeId?: string, floor?: number) {
    return this.prisma.room.findMany({
      where: {
        ...(roomTypeId && { roomTypeId }),
        ...(floor !== undefined && { floor }),
      },
      include: { roomType: true },
      orderBy: [{ floor: "asc" }, { roomNumber: "asc" }],
    });
  }

  async createPricingRule(dto: CreatePricingRuleDto) {
    await this.findRoomTypeOrFail(dto.roomTypeId);
    return this.prisma.pricingRule.create({
      data: {
        roomTypeId: dto.roomTypeId,
        type: dto.type,
        pricePerNight: dto.pricePerNight,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        priority: dto.priority ?? 0,
      },
    });
  }

  async deletePricingRule(id: string) {
    const rule = await this.prisma.pricingRule.findUnique({ where: { id } });
    if (!rule) throw new NotFoundException("Quy tắc giá không tồn tại");
    await this.prisma.pricingRule.update({
      where: { id },
      data: { isActive: false },
    });
    return { message: "Đã vô hiệu hóa quy tắc giá" };
  }

  private async findRoomTypeOrFail(id: string) {
    const rt = await this.prisma.roomType.findUnique({ where: { id } });
    if (!rt) throw new NotFoundException("Loại phòng không tồn tại");
    return rt;
  }

  private async findRoomOrFail(id: string) {
    const room = await this.prisma.room.findUnique({ where: { id } });
    if (!room) throw new NotFoundException("Phòng không tồn tại");
    return room;
  }
}
