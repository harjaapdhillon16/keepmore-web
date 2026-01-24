export type TaxBracket = {
  min: number
  max: number
  rate: number
}

export type TaxInsight = {
  type: string
  title: string
  description: string
  action: string
  potential_savings: number
}

export type InvestmentPosition = {
  symbol: string
  unrealizedLoss?: number
}

export type Transaction = {
  id: string
  amount: number
  name: string
  category?: string
  isBusiness?: boolean
  isBusinessCandidate?: boolean
}

export type UserTaxProfile = {
  country: 'US' | 'CA'
  marginalRate: number
  rrspRoom?: number
  investments?: InvestmentPosition[]
  transactions?: Transaction[]
}

export const US_TAX_BRACKETS = {
  single: [
    { min: 0, max: 11600, rate: 0.1 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Number.POSITIVE_INFINITY, rate: 0.37 },
  ],
} as const

export const CA_FEDERAL_TAX = {
  brackets: [
    { min: 0, max: 53359, rate: 0.15 },
    { min: 53359, max: 106717, rate: 0.205 },
    { min: 106717, max: 165430, rate: 0.26 },
    { min: 165430, max: 235675, rate: 0.29 },
    { min: 235675, max: Number.POSITIVE_INFINITY, rate: 0.33 },
  ],
} as const

export function calculateBracketTax(income: number, brackets: TaxBracket[]) {
  return brackets.reduce((total, bracket) => {
    if (income <= bracket.min) return total
    const taxable = Math.min(income, bracket.max) - bracket.min
    return total + taxable * bracket.rate
  }, 0)
}

export function calculateUnrealizedLosses(positions: InvestmentPosition[] = []) {
  return positions.reduce((total, position) => {
    const loss = position.unrealizedLoss ?? 0
    return loss > 0 ? total + loss : total
  }, 0)
}

export function findPotentialBusinessExpenses(
  transactions: Transaction[] = []
) {
  return transactions.filter(
    (transaction) => transaction.isBusinessCandidate && !transaction.isBusiness
  )
}

export function generateTaxInsights(userData: UserTaxProfile): TaxInsight[] {
  const insights: TaxInsight[] = []

  if (userData.country === 'CA' && (userData.rrspRoom ?? 0) > 0) {
    const rrspRoom = userData.rrspRoom ?? 0
    const taxSavings = rrspRoom * userData.marginalRate
    insights.push({
      type: 'rrsp_opportunity',
      title: 'Maximize RRSP contributions',
      description: `Contribute $${rrspRoom} to save $${Math.round(taxSavings)}`,
      action: 'contribute',
      potential_savings: taxSavings,
    })
  }

  const losses = calculateUnrealizedLosses(userData.investments)
  if (losses > 0) {
    insights.push({
      type: 'tax_loss_harvest',
      title: 'Harvest capital losses',
      description: `Sell losing positions for $${Math.round(losses * 0.3)} in tax savings`,
      action: 'view_positions',
      potential_savings: losses * 0.3,
    })
  }

  const uncategorizedBusiness = findPotentialBusinessExpenses(
    userData.transactions
  )
  if (uncategorizedBusiness.length > 0) {
    const total = uncategorizedBusiness.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    )
    insights.push({
      type: 'business_expenses',
      title: `${uncategorizedBusiness.length} potential business expenses`,
      description: `Mark these as business to deduct $${Math.round(total)}`,
      action: 'categorize',
      potential_savings: total * userData.marginalRate,
    })
  }

  return insights.sort((a, b) => b.potential_savings - a.potential_savings)
}
