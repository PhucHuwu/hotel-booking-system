import { IsString, IsInt, IsOptional, Min, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddAddonDto {
  @ApiProperty()
  @IsString()
  serviceName!: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiProperty()
  @IsNumber()
  unitPrice!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  staffNote?: string;
}

export class UpdateAddonDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  staffNote?: string;
}
