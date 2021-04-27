import axios from 'axios'

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

const findCompanyCountry = async (sellerPage, scrapeForSellerCountry) => {
  if (scrapeForSellerCountry) {
    const location = await axios.get('/api/companylocation', { params: { url: sellerPage } })
    return location.data.country
  }
  return 'N/A'
}

module.exports = {
  findParentCategory,
  findParentRank,
  findChildCategory,
  findChildRank,
  findSellerPage,
  findCompanyCountry
}
