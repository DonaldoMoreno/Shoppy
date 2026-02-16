import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class CreateSignedUploadDto {
  @IsString()
  fileName: string

  @IsString()
  mime: string

  @IsInt()
  @Min(1)
  size: number

  @IsOptional()
  @IsString()
  category?: string
}
