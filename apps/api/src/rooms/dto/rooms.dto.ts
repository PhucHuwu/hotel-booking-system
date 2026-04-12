import {
  IsString,
  IsInt,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  Min,
  IsEnum,
  IsDateString,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { RoomStatus, PricingType } from "@prisma/client";

export class CreateRoomTypeDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  maxGuests!: number;

  @ApiProperty()
  @IsNumber()
  areaSqm!: number;

  @ApiProperty()
  @IsString()
  bedType!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  amenities?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  images?: string[];
}

export class UpdateRoomTypeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  maxGuests?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  areaSqm?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bedType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  amenities?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateRoomDto {
  @ApiProperty()
  @IsString()
  roomNumber!: string;

  @ApiProperty()
  @IsInt()
  floor!: number;

  @ApiProperty()
  @IsString()
  roomTypeId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateRoomDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreatePricingRuleDto {
  @ApiProperty()
  @IsString()
  roomTypeId!: string;

  @ApiProperty({ enum: PricingType })
  @IsEnum(PricingType)
  type!: PricingType;

  @ApiProperty()
  @IsNumber()
  pricePerNight!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  priority?: number;
}
