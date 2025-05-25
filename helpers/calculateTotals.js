export const calculateDailyTotal = (transactions) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return transactions
    .filter(transaction => {
      const transactionDate = new Date(transaction.created_at)
      transactionDate.setHours(0, 0, 0, 0)
      return transactionDate.getTime() === today.getTime()
    })
    .reduce((total, transaction) => total + transaction.amount, 0)
}


export const calculateWeeklyTotal = (transactions) => {
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - 7) // 7 días hacia atrás
  startOfWeek.setHours(0, 0, 0, 0)

  return transactions
    .filter(transaction => {
      const transactionDate = new Date(transaction.created_at)
      return transactionDate >= startOfWeek
    })
    .reduce((total, transaction) => total + transaction.amount, 0)
}


export const calculateMonthlyTotal = (transactions) => {
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1) // Primer día del mes actual
  startOfMonth.setHours(0, 0, 0, 0)

  return transactions
    .filter(transaction => {
      const transactionDate = new Date(transaction.created_at)
      return transactionDate >= startOfMonth
    })
    .reduce((total, transaction) => total + transaction.amount, 0)
} 