const number = new Intl.NumberFormat('en-IN')

const lower = (rank, reviewCount) => {
  rank = Math.log10(rank)
  const result = Math.floor(50028 - 16936 * rank + 0.0808 * reviewCount)
  if (result < 0) {
    return 0
  }
  return number.format(result)
}

const expected = (rank, reviewCount) => {
  if (rank === 'No Parent Rank') {
    return 0
  }
  rank = Math.log10(rank)
  const result = Math.floor(53283 - 15911 * rank + 0.1436 * reviewCount)
  if (result < 0) {
    return 0
  }
  return result
}

const upper = (rank, reviewCount) => {
  rank = Math.log10(rank)
  const result = Math.floor(56539 - 14885 * rank + 0.2064 * reviewCount)
  if (result < 0) {
    return 0
  }
  return number.format(result)
}

const lowerGrocery = (rank, reviewCount) => {
  rank = Math.log10(rank)
  const result = 4.446288 - 0.12511 * rank - 0.02139 - Math.pow(rank, 3)
  if (result < 0) {
    return 0
  }
  return number.format(result)
}

const upperGrocery = (rank, reviewCount) => {
  rank = Math.log10(rank)
  const result = 4.592164 - 0.05986 * rank - 0.01969 - Math.pow(rank, 3)
  if (result < 0) {
    return 0
  }
  return number.format(result)
}

const calculateLower = (rank, reviewCount, parentCategory) => {
  if (parentCategory === 'Grocery & Gourmet Food') {
    return lowerGrocery(rank, reviewCount)
  }
  return lower(rank, reviewCount)
}

const calculateExpected = (rank, reviewCount, parentCategory) => {
  if (parentCategory === 'Grocery & Gourmet Food') {
    return 0
  }
  return expected(rank, reviewCount)
}

const calculateUpper = (rank, reviewCount, parentCategory) => {
  if (parentCategory === 'Grocery & Gourmet Food') {
    return upperGrocery(rank, reviewCount)
  }
  return upper(rank, reviewCount)
}

const calculateLowerLifetimeUnitsSold = (reviewCount) => {
  if (reviewCount === undefined) {
    return 0
  }
  return reviewCount / 0.08
}

const calculateUpperLifetimeUnitsSold = (reviewCount) => {
  if (reviewCount === undefined) {
    return 0
  }
  return reviewCount / 0.12
}

module.exports = {
  calculateLower,
  calculateExpected,
  calculateUpper,
  calculateLowerLifetimeUnitsSold,
  calculateUpperLifetimeUnitsSold
}
