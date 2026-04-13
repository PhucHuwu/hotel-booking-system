import { IsString, IsInt, IsOptional, Min, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'room-id' })
  @IsString()
  roomId!: string;

  @ApiProperty({ example: '2026-05-01' })
  @IsDateString()
  checkIn!: string;

  @ApiProperty({ example: '2026-05-03' })
  @IsDateString()
  checkOut!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  guestNotes?: string;
}

export class CancelBookingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}
