import { LedgerService } from './ledger.service'

describe('LedgerService', () => {
  const ledger = new LedgerService()

  test('posts entries and computes balances', () => {
    ledger.post('client_wallet', -20000, 'order:1')
    ledger.post('platform_hold', 20000, 'order:1')
    ledger.post('shopper_payable', 18000, 'order:1')

    expect(ledger.balanceFor('client_wallet')).toBe(-20000)
    expect(ledger.balanceFor('platform_hold')).toBe(20000)
    expect(ledger.balanceFor('shopper_payable')).toBe(18000)
  })
})
