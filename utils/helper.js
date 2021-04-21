const findParentCategory = (bestSellersRank) => {
  if (bestSellersRank === undefined) {
    return 'No Parent Category'
  }
  return bestSellersRank[0].category
}

const findParentRank = (bestSellersRank) => {
  if (bestSellersRank === undefined) {
    return 'No Parent Rank'
  }
  return bestSellersRank[0].rank
}

const findChildCategory = (bestSellersRank) => {
  if (bestSellersRank === undefined) {
    return 'No Child Category'
  }
  if (bestSellersRank.length === 2) {
    if (bestSellersRank[1].category === undefined) {
      return 'No Child category'
    }
    return bestSellersRank[1].category
  }
  return 'No Child Category'
}

const findChildRank = (bestSellersRank) => {
  if (bestSellersRank === undefined) {
    return 'No Child Rank'
  }
  if (bestSellersRank.length === 2) {
    if (bestSellersRank[1].rank === undefined) {
      return 'No Child Rank'
    }
    return bestSellersRank[1].rank
  }
  return 'No Child Rank'
}

const findSellerPage = (product) => {
  if (product.buybox_winner.fulfillment.third_party_seller === undefined) {
    return 'Sold By Amazon'
  }
  return product.buybox_winner.fulfillment.third_party_seller.link
}

module.exports = {
  findParentCategory,
  findParentRank,
  findChildCategory,
  findChildRank,
  findSellerPage
}
