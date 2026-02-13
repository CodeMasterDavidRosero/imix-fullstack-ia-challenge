import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateRequestDto {
  @ApiProperty({ example: 'David Mirada', maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  fullName!: string;

  @ApiProperty({ example: 'david@correo.com', maxLength: 120 })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(120)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email!: string;

  @ApiProperty({ example: '+57 3001234567', maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Matches(/^[0-9+\-\s()]+$/, {
    message: 'phone must contain only digits and valid phone symbols',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  phone!: string;

  @ApiProperty({ example: 'Integracion API y soporte', maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  service!: string;

  @ApiProperty({
    example: 'Necesito integrar mi formulario web con su API y recibir estado.',
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  message!: string;
}
