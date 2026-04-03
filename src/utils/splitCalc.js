/**
 * Compute each member's share for a single expense.
 * Returns { memberName: amountOwed }
 */
export function computeShares(expense, members) {
  const { amount, payer, splitType, involvedMembers = members, splitAmounts = {} } = expense
  const shares = {}

  if (splitType === 'payer-only') {
    members.forEach(m => { shares[m] = 0 })
    shares[payer] = 0 // payer pays for themselves, no one else owes
    return shares
  }

  if (splitType === 'equal') {
    const perPerson = amount / involvedMembers.length
    members.forEach(m => { shares[m] = 0 })
    involvedMembers.forEach(m => { shares[m] = perPerson })
    return shares
  }

  if (splitType === 'custom') {
    members.forEach(m => { shares[m] = splitAmounts[m] || 0 })
    return shares
  }

  return shares
}

/**
 * Given all expenses and members, compute net balances.
 * Positive = member is owed money. Negative = member owes money.
 */
export function computeBalances(expenses, members) {
  const balances = {}
  members.forEach(m => { balances[m] = 0 })

  for (const expense of expenses) {
    const { payer, amount, splitType } = expense
    if (splitType === 'payer-only') continue

    const shares = computeShares(expense, members)

    // Payer fronted the money
    balances[payer] = (balances[payer] || 0) + amount

    // Each member's share is subtracted from their balance
    members.forEach(m => {
      balances[m] = (balances[m] || 0) - (shares[m] || 0)
    })
  }

  return balances
}

/**
 * Simplify debts into minimal transactions.
 * Returns [{ from, to, amount }]
 */
export function computeSettlements(balances) {
  const creditors = []
  const debtors = []

  Object.entries(balances).forEach(([member, balance]) => {
    if (balance > 0.01) creditors.push({ member, amount: balance })
    else if (balance < -0.01) debtors.push({ member, amount: -balance })
  })

  creditors.sort((a, b) => b.amount - a.amount)
  debtors.sort((a, b) => b.amount - a.amount)

  const settlements = []

  while (creditors.length > 0 && debtors.length > 0) {
    const creditor = creditors[0]
    const debtor = debtors[0]
    const amount = Math.min(creditor.amount, debtor.amount)

    settlements.push({ from: debtor.member, to: creditor.member, amount: Math.round(amount * 100) / 100 })

    creditor.amount -= amount
    debtor.amount -= amount

    if (creditor.amount < 0.01) creditors.shift()
    if (debtor.amount < 0.01) debtors.shift()
  }

  return settlements
}

/**
 * Compute total spent per category.
 * Returns [{ label, color, total }]
 */
export function computeCategoryTotals(expenses, categories) {
  const totals = {}
  expenses.forEach(e => {
    totals[e.category] = (totals[e.category] || 0) + e.amount
  })
  return categories
    .map(cat => ({ label: cat.label, color: cat.color, total: totals[cat.label] || 0 }))
    .filter(c => c.total > 0)
}

/**
 * Compute total spent per category for a specific member.
 */
export function computeMemberCategoryTotals(expenses, categories, member) {
  const filtered = expenses.filter(e => {
    if (e.splitType === 'payer-only') return e.payer === member
    const involved = e.involvedMembers || []
    return involved.includes(member)
  })

  const memberExpenses = filtered.map(e => {
    const shares = computeShares(e, e.involvedMembers || [member])
    return { ...e, amount: shares[member] || 0 }
  })

  return computeCategoryTotals(memberExpenses, categories)
}
