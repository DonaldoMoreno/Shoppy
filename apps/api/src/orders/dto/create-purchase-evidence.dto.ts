import { IsInt, IsString, Min } from 'class-validator'

export class CreatePurchaseEvidenceDto {
  @IsString()
  receiptKey: string

  @IsString()
  receiptUrl: string

  @IsString()
  receiptMime: string

  @IsInt()
  @Min(1)
  receiptSize: number

  @IsString()
  productPhotoKey: string

  @IsString()
  productPhotoUrl: string

  @IsString()
  productPhotoMime: string

  @IsInt()
  @Min(1)
  productPhotoSize: number

  @IsInt()
  @Min(0)
  receiptAmountCents: number
}
