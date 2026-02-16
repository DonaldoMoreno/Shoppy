import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class CreateOfferDto {
  @IsString()
  requestId: string

  @IsInt()
  @Min(0)
  itemEstimateCents: number

  @IsInt()
  @Min(0)
  shopperFeeCents: number

  @IsInt()
  @Min(0)
  shippingEstimateCents: number

  @IsInt()
  @Min(1)
  slaDays: number

  @IsOptional()
  @IsString()
  notes?: string
}
