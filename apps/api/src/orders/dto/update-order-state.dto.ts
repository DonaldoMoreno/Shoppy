import { IsIn, IsString } from 'class-validator'

export const ORDER_STATES = [
  'CREATED',
  'FUNDED',
  'PURCHASED',
  'SHIPPED',
  'DELIVERED',
  'COMPLETED',
  'CANCELLED',
  'DISPUTED',
  'REFUNDED'
] as const

export type OrderState = typeof ORDER_STATES[number]

export class UpdateOrderStateDto {
  @IsString()
  @IsIn(ORDER_STATES)
  state: OrderState
}
