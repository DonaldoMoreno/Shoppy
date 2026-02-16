import { RiskService } from './risk.service'

describe('RiskService', () => {
  const svc = new RiskService()

  test('flags new shopper with high amount for review/block', () => {
    const result = svc.evaluateUserRisk({ role: 'SHOPPER', createdAt: new Date() }, 40000)
    expect(result.score).toBeGreaterThanOrEqual(60)
    expect(result.decision).toMatch(/REVIEW|BLOCK/)
    expect(result.reasons).toContain('NEW_SHOPPER_HIGH_VALUE')
  })

  test('allows long-standing client for small orders', () => {
    const oldDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
    const result = svc.evaluateUserRisk({ role: 'CLIENT', createdAt: oldDate }, 1000)
    expect(result.decision).toBe('ALLOW')
  })
})
