import { Injectable } from '@nestjs/common'

export type RiskDecision = 'ALLOW' | 'REVIEW' | 'BLOCK'

@Injectable()
export class RiskService {
  evaluateUserRisk(user: { role: string; createdAt?: Date; historicalFlags?: number }, orderAmountCents: number) {
    let score = 0
    const reasons: string[] = []

    const isNewUser = !user.createdAt || (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24) < 7
    if (user.role === 'SHOPPER' && isNewUser && orderAmountCents > 30000) {
      score += 60
      reasons.push('NEW_SHOPPER_HIGH_VALUE')
    }

    if (user.historicalFlags && user.historicalFlags > 3) {
      score += 50
      reasons.push('HISTORICAL_FLAGS')
    }

    // simple mapping
    const decision: RiskDecision = score >= 70 ? 'BLOCK' : score >= 30 ? 'REVIEW' : 'ALLOW'
    return { score, decision, reasons }
  }
}
