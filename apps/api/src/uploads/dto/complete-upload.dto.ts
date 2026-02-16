import { IsInt, IsString, Min } from 'class-validator'

export class CompleteUploadDto {
  @IsString()
  key: string

  @IsString()
  url: string

  @IsString()
  mime: string

  @IsInt()
  @Min(1)
  size: number
}
