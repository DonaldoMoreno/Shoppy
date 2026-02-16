import { Injectable } from '@nestjs/common'

export type LedgerAccount = 'client_wallet' | 'platform_hold' | 'shopper_payable' | 'platform_revenue' | 'reserve_hold'

export interface LedgerEntry {
  id: string
  account: LedgerAccount
  amountCents: number
  reference?: string
  createdAt: string
}

@Injectable()
export class LedgerService {
  private entries: LedgerEntry[] = []

  post(account: LedgerAccount, amountCents: number, reference?: string) {
    const entry: LedgerEntry = { id: Math.random().toString(36).slice(2), account, amountCents, reference, createdAt: new Date().toISOString() }
    this.entries.push(entry)
    return entry
  }

  balanceFor(account: LedgerAccount) {
    return this.entries.filter((e) => e.account === account).reduce((s, e) => s + e.amountCents, 0)
  }

  all() {
    return this.entries.slice().reverse()
  }
}
