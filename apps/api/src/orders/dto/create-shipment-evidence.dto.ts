import { IsInt, IsString, Min } from 'class-validator'

export class CreateShipmentEvidenceDto {
  @IsString()
  shippingReceiptKey: string

  @IsString()
  shippingReceiptUrl: string

  @IsString()
  shippingReceiptMime: string

  @IsInt()
  @Min(1)
  shippingReceiptSize: number

  @IsString()
  packagePhotoKey: string

  @IsString()
  packagePhotoUrl: string

  @IsString()
  packagePhotoMime: string

  @IsInt()
  @Min(1)
  packagePhotoSize: number
}
