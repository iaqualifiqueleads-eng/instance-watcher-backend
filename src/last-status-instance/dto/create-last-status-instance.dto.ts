import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateLastStatusInstanceDto {
  @ApiProperty({
    type: Number,
    required: true,
    example: 3453445645
  })
  @IsNumber()
  @IsPositive()
  id: number;

  @ApiProperty({
    type: String,
    required: true,
    example: "agenteX"
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    example: "5527992788660"
  })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    enum: String,
    required: true,
    example: "DISCONNECTED"
  })
  @IsString()
  @IsNotEmpty()
  status: string
}
