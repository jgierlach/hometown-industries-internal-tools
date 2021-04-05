const number = new Intl.NumberFormat('en-IN')

const lower = (rank, reviewCount) => {
  rank = Math.log10(rank)
  console.log("rank", rank)
  console.log("Review Count", reviewCount)
  return number.format(Math.floor(50028 - 16936 * rank + .0808 * reviewCount))
}

const expected = (rank, reviewCount) => {
  rank = Math.log10(rank)
  return number.format(Math.floor(53283 - 15911 * rank + .1436 * reviewCount))
}

const upper = (rank, reviewCount) => {
  rank = Math.log10(rank)
  return number.format(Math.floor(56539 - 14885 * rank + .2064 * reviewCount))
}

module.exports = {
  lower,
  expected,
  upper
}