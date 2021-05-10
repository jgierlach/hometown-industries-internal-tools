import axios from 'axios'

const findParentCategory = (bestSellersRank) => {
  if (bestSellersRank === undefined) {
    return 'No Parent Category'
  }
  return bestSellersRank[0].category
}

const findBestSellersRank = (product) => {
  if (product === undefined) {
    return undefined
  }
  if (product.bestsellers_rank === undefined) {
    return undefined
  }
  return product.bestsellers_rank
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
  if (product === undefined || product.buybox_winner === undefined || product.buybox_winner.fulfillment === undefined || product.buybox_winner.fulfillment.third_party_seller === undefined || product.buybox_winner.fulfillment.third_party_seller.link === undefined) {
    return 'Sold By Amazon'
  }
  return product.buybox_winner.fulfillment.third_party_seller.link
}

const findCompanyCountry = async (sellerPage, scrapeForSellerCountry) => {
  if (sellerPage === 'Sold By Amazon') {
    return 'Sold By Amazon'
  }
  if (scrapeForSellerCountry) {
    const location = await axios.get('/api/companylocation', { params: { url: sellerPage } })
    return location.data.country
  }
  return 'N/A'
}

const findThumbnail = (product) => {
  if (product === undefined) {
    return 'https://i.stack.imgur.com/mwFzF.png'
  }
  if (product.main_image === undefined) {
    return 'https://i.stack.imgur.com/mwFzF.png'
  }
  return product.main_image.link
}

const findReviewCount = (product) => {
  if (product === undefined) {
    return 0
  }
  if (product.ratings_total === undefined) {
    return 0
  }
  return product.ratings_total
}

const findReviewScore = (product) => {
  if (product === undefined) {
    return 'Not rated'
  }
  if (product.rating === undefined) {
    return 'Not Rated'
  }
  return product.rating
}

const findPrice = (product) => {
  if (product === undefined || product.price === undefined || product.price.value === undefined) {
    return 0
  }
  return product.price.value
}

module.exports = {
  findParentCategory,
  findParentRank,
  findChildCategory,
  findChildRank,
  findSellerPage,
  findCompanyCountry,
  findThumbnail,
  findReviewCount,
  findReviewScore,
  findBestSellersRank,
  findPrice
}
