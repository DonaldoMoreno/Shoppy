import { IsString } from 'class-validator'

export class CaptureTrackingDto {
  @IsString()
  carrier: string

  @IsString()
  trackingNumber: string
}
