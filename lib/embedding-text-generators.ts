// lib/embedding-text-generators.ts

export function createTransactionEmbeddingText(txn: any): string {
    const parts: string[] = []
    
    // Merchant (most important)
    parts.push(txn.merchant_name)
    
    // Category
    if (txn.personal_finance_category) {
      const cat = typeof txn.personal_finance_category === 'string'
        ? JSON.parse(txn.personal_finance_category)
        : txn.personal_finance_category
      parts.push(`${cat.primary} category`)
      if (cat.detailed) parts.push(cat.detailed)
    } else if (txn.category) {
      parts.push(`${txn.category} category`)
    }
    
    // Amount context
    const amount = parseFloat(txn.amount)
    if (amount < 10) parts.push('small purchase')
    else if (amount < 50) parts.push('moderate purchase')
    else if (amount < 200) parts.push('significant purchase')
    else parts.push('expensive purchase')
    parts.push(`$${amount.toFixed(2)}`)
    
    // Date context
    const date = new Date(txn.date)
    parts.push(date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    }))
    parts.push(date.toLocaleDateString('en-US', { 
      weekday: 'long' 
    }))
    
    // Payment channel
    if (txn.payment_channel) {
      parts.push(`${txn.payment_channel} payment`)
    }
    
    return parts.join('. ')
  }
  
  export function createInvestmentEmbeddingText(inv: any): string {
    const parts: string[] = []
    
    // Security name (most important)
    parts.push(inv.security_name)
    
    // Symbol
    if (inv.symbol) {
      parts.push(`ticker symbol ${inv.symbol}`)
    }
    
    // Account type
    parts.push(`${inv.account_type} account`)
    parts.push(`${inv.account_subtype}`)
    parts.push(`held at ${inv.institution_name}`)
    
    // Holding details
    const quantity = parseFloat(inv.quantity)
    const value = parseFloat(inv.value)
    const costBasis = parseFloat(inv.cost_basis)
    
    parts.push(`${quantity} shares`)
    parts.push(`worth $${value.toFixed(2)}`)
    
    // Performance
    const gainLoss = value - (quantity * costBasis)
    if (gainLoss > 0) {
      parts.push(`profitable position`)
      parts.push(`gain of $${gainLoss.toFixed(2)}`)
    } else if (gainLoss < 0) {
      parts.push(`loss position`)
      parts.push(`down $${Math.abs(gainLoss).toFixed(2)}`)
    }
    
    // Account name
    parts.push(inv.account_name)
    
    return parts.join('. ')
  }
  
  export function createRecurringEmbeddingText(rec: any): string {
    const parts: string[] = []
    
    // Description/Merchant
    parts.push(rec.description)
    if (rec.merchant_name) {
      parts.push(rec.merchant_name)
    }
    
    // Frequency (very important for recurring!)
    parts.push(`${rec.frequency.toLowerCase()} recurring payment`)
    parts.push('subscription')
    
    // Status
    if (rec.status === 'MATURE') {
      parts.push('established recurring transaction')
    }
    
    // Amount
    const avgAmount = typeof rec.average_amount === 'string'
      ? JSON.parse(rec.average_amount)
      : rec.average_amount
    
    const amount = avgAmount.amount
    parts.push(`$${amount} per ${rec.frequency.toLowerCase()}`)
    
    // Category
    if (rec.personal_finance_category) {
      const cat = typeof rec.personal_finance_category === 'string'
        ? JSON.parse(rec.personal_finance_category)
        : rec.personal_finance_category
      parts.push(`${cat.primary} category`)
    }
    
    // Duration context
    const firstDate = new Date(rec.first_date)
    const lastDate = new Date(rec.last_date)
    const monthsDuration = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    
    if (monthsDuration > 12) {
      parts.push('long-term subscription')
    } else if (monthsDuration > 6) {
      parts.push('established subscription')
    } else {
      parts.push('recent subscription')
    }
    
    return parts.join('. ')
  }