import { z } from 'zod'

export const UserRole = z.enum(['CLIENT', 'SHOPPER', 'ADMIN'])
export const KycStatus = z.enum(['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'])

export const UserCreate = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
  role: UserRole.optional()
})

export type UserCreate = z.infer<typeof UserCreate>
